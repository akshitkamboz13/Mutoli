/**
 * Mutoli Order Processing - Google Apps Script v2
 * Updated to handle screenshots, enhanced data structure, and improved error handling
 */

function doPost(e) {
  try {
    // Check if event object exists
    if (!e) {
      const errorMsg = 'No event object received - script may not be deployed as web app';
      console.error('❌ ' + errorMsg);
      Logger.log('❌ ' + errorMsg);
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          message: errorMsg,
          timestamp: new Date().toISOString(),
          debug: 'Event object is null or undefined'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Use both console.log and Logger.log for maximum compatibility
    console.log('🔄 Received POST request');
    Logger.log('🔄 Received POST request');
    
    // Safe property access with null checks
    const postData = e.postData || {};
    const parameter = e.parameter || {};
    
    console.log('📦 Full request object:', JSON.stringify(e, null, 2));
    Logger.log('📦 Full request object: ' + JSON.stringify(e, null, 2));
    
    console.log('📦 Request parameters:', parameter);
    Logger.log('📦 Request parameters: ' + JSON.stringify(parameter));
    
    console.log('📨 Post data type:', postData.type);
    Logger.log('📨 Post data type: ' + (postData.type || 'undefined'));
    
    console.log('📄 Post data contents (raw):', postData.contents);
    Logger.log('📄 Post data contents (raw): ' + (postData.contents || 'undefined'));
    
    console.log('📄 Post data length:', postData.contents?.length);
    Logger.log('📄 Post data length: ' + (postData.contents?.length || 0));
    
    // Get or create the spreadsheet for Mutoli orders
    const sheet = getOrCreateOrdersSheet();
    
    // Initialize data object
    let data = {};
    let dataSource = 'unknown';
    
    // Handle different content types with enhanced debugging
    if (postData && postData.type === 'application/json' && postData.contents) {
      try {
        // JSON data
        console.log('🔄 Attempting to parse JSON data...');
        Logger.log('🔄 Attempting to parse JSON data...');
        
        data = JSON.parse(postData.contents);
        dataSource = 'json';
        
        console.log('✅ Parsed JSON data successfully:', JSON.stringify(data, null, 2));
        Logger.log('✅ Parsed JSON data successfully: ' + JSON.stringify(data, null, 2));
      } catch (jsonError) {
        console.error('❌ JSON parsing failed:', jsonError);
        Logger.log('❌ JSON parsing failed: ' + jsonError.toString());
        
        console.log('📄 Raw contents that failed to parse:', postData.contents);
        Logger.log('📄 Raw contents that failed to parse: ' + postData.contents);
        
        console.log('📄 Raw contents type:', typeof postData.contents);
        Logger.log('📄 Raw contents type: ' + typeof postData.contents);
        
        // Fall back to form data
        data = parameter;
        dataSource = 'fallback-form';
        console.log('🔄 Falling back to form data:', data);
        Logger.log('🔄 Falling back to form data: ' + JSON.stringify(data));
      }
    } else if (parameter && Object.keys(parameter).length > 0) {
      // Form data (URL parameters)
      data = parameter;
      dataSource = 'form-params';
      console.log('✅ Using form/parameter data:', JSON.stringify(data, null, 2));
      Logger.log('✅ Using form/parameter data: ' + JSON.stringify(data, null, 2));
    } else {
      // No data received - create a test entry with debugging info (but reduce frequency)
      console.log('⚠️ No data received, creating debug entry');
      Logger.log('⚠️ No data received, creating debug entry');
      
      console.log('🔍 Debug info - postData exists:', !!postData);
      Logger.log('🔍 Debug info - postData exists: ' + !!postData);
      
      console.log('🔍 Debug info - postData type:', postData.type);
      Logger.log('🔍 Debug info - postData type: ' + (postData.type || 'undefined'));
      
      console.log('🔍 Debug info - postData has contents:', !!postData.contents);
      Logger.log('🔍 Debug info - postData has contents: ' + !!postData.contents);
      
      console.log('🔍 Debug info - parameter exists:', !!parameter);
      Logger.log('🔍 Debug info - parameter exists: ' + !!parameter);
      
      console.log('🔍 Debug info - parameter keys:', Object.keys(parameter));
      Logger.log('🔍 Debug info - parameter keys: ' + Object.keys(parameter).join(', '));
      
      // Only create NO-DATA entry if it's been more than 30 seconds since last one
      const currentTime = Date.now();
      const lastDebugTime = PropertiesService.getScriptProperties().getProperty('lastDebugEntry');
      
      if (!lastDebugTime || (currentTime - parseInt(lastDebugTime)) > 30000) {
        console.log('📝 Creating debug entry (first in 30+ seconds)');
        Logger.log('📝 Creating debug entry (first in 30+ seconds)');
        
        data = {
          orderNumber: 'NO-DATA-' + Date.now(),
          fullName: 'No Data Received',
          product: 'Debug Entry - Check logs',
          orderStatus: 'Debug - No Data Received',
          debugInfo: `postData: ${!!postData}, type: ${postData.type || 'undefined'}, hasContents: ${!!postData.contents}, paramKeys: ${Object.keys(parameter).length}`
        };
        dataSource = 'no-data-debug';
        
        // Store timestamp to prevent frequent debug entries
        PropertiesService.getScriptProperties().setProperty('lastDebugEntry', currentTime.toString());
      } else {
        console.log('🔇 Skipping debug entry (too frequent)');
        Logger.log('🔇 Skipping debug entry (too frequent)');
        
        // Return early without creating sheet entry
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: false, 
            message: 'No data received - debug entry skipped (too frequent)',
            timestamp: new Date().toISOString()
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Log what we received with data source
    console.log('📊 Final data object (source: ' + dataSource + '):', {
      orderNumber: data.orderNumber,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      product: data.product,
      totalAmount: data.totalAmount,
      orderStatus: data.orderStatus,
      dataSource: dataSource
    });
    
    // Check if this is an update request for existing order
    if (data.updateMode === 'WHATSAPP_UPDATE' && data.orderNumber) {
      console.log('🔄 Processing WhatsApp update for existing order:', data.orderNumber);
      Logger.log('🔄 Processing WhatsApp update for existing order: ' + data.orderNumber);
      
      // Find and update the existing order row
      const updateResult = updateExistingOrder(sheet, data);
      
      if (updateResult.success) {
        console.log('✅ Order updated successfully at row:', updateResult.row);
        Logger.log('✅ Order updated successfully at row: ' + updateResult.row);
        
        // Send email notification for WhatsApp confirmation
        if (data.fullName && data.phone && data.email) {
          sendEmailNotification(data);
        }
        
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: true, 
            message: 'Order updated successfully',
            orderNumber: data.orderNumber,
            action: 'WhatsApp confirmation tracked',
            timestamp: new Date().toISOString()
          }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        console.log('⚠️ Could not find existing order, creating new entry');
        Logger.log('⚠️ Could not find existing order, creating new entry');
        // Continue with normal processing to create new entry
      }
    }
    
    // Validate and process the data
    console.log('🔍 Validating received data...');
    
    // Check if this is real order data or test data
    const hasRealData = data.orderNumber && data.orderNumber !== '' && 
                       !data.orderNumber.startsWith('UNKNOWN-') &&
                       !data.orderNumber.startsWith('TEST-');
    
    const hasCustomerData = data.fullName && data.fullName !== '' && 
                           data.fullName !== 'Test Customer';
    
    const hasProductData = data.product && data.product !== '' && 
                          data.product !== 'Test Product';
    
    console.log('📋 Data validation results:', {
      hasRealData: hasRealData,
      hasCustomerData: hasCustomerData,
      hasProductData: hasProductData,
      orderNumber: data.orderNumber,
      fullName: data.fullName,
      product: data.product
    });
    
    // If no real data is present, still process but mark appropriately
    if (!hasRealData && !hasCustomerData && !hasProductData) {
      console.log('⚠️ Processing incomplete data - likely test or connection check');
      data.orderNumber = data.orderNumber || 'INCOMPLETE-' + Date.now();
      data.fullName = data.fullName || 'Data Missing';
      data.product = data.product || 'No Product Selected';
      data.orderStatus = 'Incomplete Data Received';
    } else {
      console.log('✅ Processing real order data');
      data.orderNumber = data.orderNumber || generateOrderNumber();
    }
    
    console.log('📋 Processing order data:', {
      orderNumber: data.orderNumber,
      fullName: data.fullName,
      product: data.product,
      orderStatus: data.orderStatus
    });
    
    // Prepare the row data with enhanced fields - ensure all values are strings
    const rowData = [
      String(data.orderNumber || generateOrderNumber()),
      String(data.formattedTimestamp || new Date().toLocaleString('en-IN')),
      String(data.submissionDate || new Date().toLocaleDateString('en-IN')),
      String(data.submissionTime || new Date().toLocaleTimeString('en-IN')),
      String(data.fullName || ''),
      String(data.phone || ''),
      String(data.email || ''),
      String(data.address || ''),
      String(data.product || ''),
      String(data.quantity || '1'),
      String(data.totalAmount || '0'),
      String(data.notes || ''),
      String(data.orderStatus || 'New'),
      String(data.source || 'Website'),
      String(data.step || 'Order Submission'),
      String(data.paymentDate || ''),
      String(data.paymentTime || ''),
      String(data.whatsappClickTime || ''), // New: WhatsApp click tracking
      String(data.whatsappClickDate || ''), // New: WhatsApp click date
      String(data.action || ''), // New: Action taken (e.g., "Confirm Order via WhatsApp")
      String(data.screenshotStatus || 'Screenshot Required'), // Screenshot status
      String(data.timestamp || new Date().toISOString()), // Raw timestamp for sorting
      String('Pending') // Overall status
    ];
    
    console.log('📊 Row data prepared (length: ' + rowData.length + '):', rowData.slice(0, 5));
    
    // Check if headers exist, add them only if sheet is completely empty
    const lastRow = sheet.getLastRow();
    console.log('📊 Current sheet has rows:', lastRow);
    
    if (lastRow === 0) {
      console.log('📝 Adding headers to empty sheet...');
      const headers = [
        'Order Number',
        'Submission DateTime',
        'Submission Date',
        'Submission Time',
        'Customer Name',
        'Phone',
        'Email',
        'Address',
        'Product',
        'Quantity',
        'Total Amount',
        'Notes',
        'Order Status',
        'Source',
        'Step',
        'Payment Date',
        'Payment Time',
        'WhatsApp Click Time',
        'WhatsApp Click Date',
        'Action',
        'Screenshot Status',
        'Raw Timestamp',
        'Overall Status'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      console.log('✅ Headers added successfully');
    } else {
      console.log('📋 Headers already exist, skipping header creation');
    }
    
    // Add the data to the sheet
    console.log('📝 Adding data row to sheet...');
    console.log('📊 Data to be added:', rowData);
    
    try {
      sheet.appendRow(rowData);
      const newLastRow = sheet.getLastRow();
      console.log('✅ Data added successfully! New row count:', newLastRow);
      console.log('📍 Data added at row:', newLastRow);
    } catch (appendError) {
      console.error('❌ Error adding data to sheet:', appendError);
      throw new Error('Failed to add data to sheet: ' + appendError.message);
    }
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, rowData.length);
    
    // Send email notification for complete orders
    if (data.fullName && data.phone && data.email) {
      sendEmailNotification(data);
    }
    
    // Log successful processing
    console.log('Order processed successfully:', data.orderNumber);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Order received successfully',
        orderNumber: data.orderNumber,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing order:', error);
    Logger.log('Error processing order: ' + error.toString());
    
    // Log error details with safe property access
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      postData: e ? (e.postData || 'No postData') : 'No event object',
      parameter: e ? (e.parameter || 'No parameter') : 'No event object'
    };
    
    console.error('Error details:', errorDetails);
    Logger.log('Error details: ' + JSON.stringify(errorDetails));
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        message: 'Error processing order: ' + error.message,
        timestamp: new Date().toISOString(),
        errorDetails: errorDetails
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(data) {
  try {
    console.log('🔄 Attempting to send email notification for order:', data.orderNumber);
    
    // Get current user email for security
    const currentUserEmail = Session.getActiveUser().getEmail();
    console.log('📧 Current user email:', currentUserEmail);
    
    // Dynamic subject based on order status
    let subject = '';
    if (data.orderStatus === 'WhatsApp Confirmation Initiated') {
      subject = `🔥 URGENT: WhatsApp Confirmation - ${data.orderNumber}`;
    } else if (data.orderStatus === 'Payment Completed - Ready for WhatsApp') {
      subject = `💳 Payment Completed & WhatsApp Sent - ${data.orderNumber}`;
    } else if (data.orderStatus === 'Order Created - Proceeding to Payment') {
      subject = `📝 New Order Created - ${data.orderNumber}`;
    } else {
      subject = `🛒 New Mutoli Order - ${data.orderNumber}`;
    }
    
    // Create detailed email body
    const body = `
🌟 NEW ORDER RECEIVED ON MUTOLI WEBSITE 🌟

📋 ORDER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number: ${data.orderNumber}
Order Status: ${data.orderStatus || 'New'}
Step: ${data.step || 'Order Submission'}

👤 CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.address}

🛍️ PRODUCT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Product: ${data.product}
Quantity: ${data.quantity}
Total Amount: ₹${data.totalAmount}

💳 PAYMENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment Status: ${data.orderStatus === 'Payment Completed - Ready for WhatsApp' ? '✅ Payment Completed & WhatsApp Sent' : data.orderStatus === 'Order Created - Proceeding to Payment' ? '⏳ Payment Pending' : '⏳ Pending'}
Payment Date: ${data.paymentDate || 'Not completed yet'}
Payment Time: ${data.paymentTime || 'Not completed yet'}

📱 WHATSAPP CONFIRMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhatsApp Status: ${data.orderStatus === 'WhatsApp Confirmation Initiated' ? '✅ WhatsApp Link Clicked' : data.orderStatus === 'Payment Completed - Ready for WhatsApp' ? '✅ WhatsApp Message Sent' : '⏳ Not initiated'}
WhatsApp Click Time: ${data.whatsappClickTimeFormatted || 'Not clicked yet'}
Action: ${data.action || 'No action taken'}
Screenshot Status: ${data.screenshotStatus || 'Not Required (New Flow)'}

📝 ADDITIONAL NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.notes || 'No additional notes'}

⏰ SUBMISSION TIME:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${data.formattedTimestamp || new Date().toLocaleString('en-IN')}
Source: ${data.source || 'Website'}

🚨 IMPORTANT REMINDERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Customer has provided all details upfront (NEW FLOW)
• No screenshot collection needed in website
• Customer will send payment proof directly via WhatsApp
• Verify UPI transaction when customer messages
• Update order status after verification

💼 ACTION REQUIRED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.orderStatus === 'WhatsApp Confirmation Initiated' ? 
  '🔥 URGENT - Customer has sent WhatsApp message!' : 
  data.orderStatus === 'Payment Completed - Ready for WhatsApp' ?
  '💳 Payment completed - Expecting WhatsApp message' :
  data.orderStatus === 'Order Created - Proceeding to Payment' ?
  '📝 Order created - Customer proceeding to payment' :
  '📋 Standard order processing required'}

1. ${data.orderStatus === 'WhatsApp Confirmation Initiated' ? 
    'Check WhatsApp immediately for customer message' : 
    data.orderStatus === 'Payment Completed - Ready for WhatsApp' ?
    'Wait for WhatsApp message with payment proof' :
    'Customer will proceed to payment next'}
2. Verify UPI transaction when proof arrives
3. Update order status in spreadsheet
4. Confirm order details with customer
5. Prepare product for dispatch

${data.orderStatus === 'WhatsApp Confirmation Initiated' ? 
  '⚡ HIGH PRIORITY: Customer is actively sending order details!' : 
  data.orderStatus === 'Payment Completed - Ready for WhatsApp' ?
  '🎯 READY: Customer completed payment, expecting WhatsApp contact' :
  '📝 IN PROGRESS: Order flow in progress'}

Best regards,
Mutoli Order Management System 🌟
    `;
    
    // Email addresses for notifications - use current user email as primary
    const emails = [
      currentUserEmail, // Primary - current Google account
      'akshitkamboz13@gmail.com',
      // Add more email addresses as needed
      // 'admin@mutoli.com',
      // 'orders@mutoli.com'
    ];
    
    // Remove duplicates
    const uniqueEmails = [...new Set(emails.filter(email => email))];
    
    console.log('📧 Sending emails to:', uniqueEmails);
    
    // Send email to all recipients
    let emailsSent = 0;
    uniqueEmails.forEach(email => {
      try {
        MailApp.sendEmail({
          to: email,
          subject: subject,
          body: body,
          htmlBody: body.replace(/\n/g, '<br>').replace(/━/g, '─')
        });
        emailsSent++;
        console.log(`✅ Email sent successfully to: ${email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${email}:`, emailError);
      }
    });
    
    console.log(`📧 Email notification completed: ${emailsSent}/${uniqueEmails.length} emails sent successfully`);
    return emailsSent > 0;
    
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

function doGet(e) {
  try {
    // Enhanced GET handler for testing
    console.log('🔄 Received GET request');
    Logger.log('🔄 Received GET request');
    
    // Log any parameters received
    if (e && e.parameter) {
      console.log('📦 GET parameters:', e.parameter);
      Logger.log('📦 GET parameters: ' + JSON.stringify(e.parameter));
    }
    
    // Handle GET requests (for testing and health checks)
    const response = {
      status: 'active',
      message: 'Mutoli Order API v2 is working!',
      timestamp: new Date().toISOString(),
      version: '2.0',
      deployment: 'Web App Active',
      receivedParameters: e ? Object.keys(e.parameter || {}).length : 0,
      features: [
        'Enhanced data structure',
        'Screenshot handling support',
        'Payment tracking',
        'Step-by-step order flow',
        'Improved error handling',
        'Auto-formatted spreadsheet',
        'Email notifications',
        'Multiple submission methods support'
      ]
    };
    
    console.log('✅ Returning GET response:', response);
    Logger.log('✅ Returning GET response: ' + JSON.stringify(response));
    
    return ContentService
      .createTextOutput(JSON.stringify(response, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function generateOrderNumber() {
  const date = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14); 
  const random = Math.random().toString(36).substring(2, 6).toUpperCase(); 
  return "ORD-" + date + "-" + random;
}

/**
 * Get or create the Mutoli Orders spreadsheet
 * This ensures the script works even if not bound to a specific sheet
 */
function getOrCreateOrdersSheet() {
  try {
    // Option 1: Try to get the active spreadsheet if script is bound to one
    try {
      const activeSheet = SpreadsheetApp.getActiveSheet();
      if (activeSheet) {
        console.log('Using bound spreadsheet:', activeSheet.getName());
        return activeSheet;
      }
    } catch (e) {
      console.log('No active spreadsheet found, will create new one');
    }
    
    // Option 2: Look for existing "Mutoli Orders" spreadsheet in Drive
    const files = DriveApp.getFilesByName('Mutoli Orders');
    if (files.hasNext()) {
      const file = files.next();
      const spreadsheet = SpreadsheetApp.open(file);
      console.log('Found existing Mutoli Orders spreadsheet');
      return spreadsheet.getActiveSheet();
    }
    
    // Option 3: Create new spreadsheet
    console.log('Creating new Mutoli Orders spreadsheet');
    const newSpreadsheet = SpreadsheetApp.create('Mutoli Orders');
    const sheet = newSpreadsheet.getActiveSheet();
    sheet.setName('Orders');
    
    // Share with owner (you) for easier access
    const email = Session.getActiveUser().getEmail();
    if (email) {
      newSpreadsheet.addEditor(email);
    }
    
    console.log('Created new spreadsheet with ID:', newSpreadsheet.getId());
    console.log('Spreadsheet URL:', newSpreadsheet.getUrl());
    
    return sheet;
    
  } catch (error) {
    console.error('Error getting/creating orders sheet:', error);
    throw new Error('Failed to access or create orders spreadsheet: ' + error.message);
  }
}

/**
 * Alternative function using a specific spreadsheet ID
 * Use this if you want to specify a particular spreadsheet
 */
function getOrdersSheetById(spreadsheetId) {
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName('Orders');
    
    if (!sheet) {
      // Create the Orders sheet if it doesn't exist
      sheet = spreadsheet.insertSheet('Orders');
    }
    
    return sheet;
  } catch (error) {
    console.error('Error opening spreadsheet by ID:', error);
    throw new Error('Failed to open spreadsheet with ID: ' + spreadsheetId);
  }
}

/**
 * Test function to diagnose Google Apps Script issues
 * Run this in the Apps Script editor to test basic functionality
 */
function testScriptFunctionality() {
  console.log('🧪 Starting comprehensive script functionality test...');
  
  try {
    // Test 1: Check current user
    const userEmail = Session.getActiveUser().getEmail();
    console.log('✅ User email:', userEmail);
    
    // Test 2: Test spreadsheet access
    console.log('🧪 Testing spreadsheet access...');
    const sheet = getOrCreateOrdersSheet();
    console.log('✅ Spreadsheet access successful, sheet name:', sheet.getName());
    
    // Test 3: Test writing to sheet
    console.log('🧪 Testing sheet writing...');
    const testRow = [
      'TEST-' + Date.now(),
      new Date().toLocaleString('en-IN'),
      new Date().toLocaleDateString('en-IN'),
      new Date().toLocaleTimeString('en-IN'),
      'Test Customer',
      '9999999999',
      'test@example.com',
      'Test Address',
      'Test Product',
      '1',
      '100',
      'Test Notes',
      'Test Status',
      'Test',
      'Script Test',
      '', '', '', '', 'Test Action',
      'Test Screenshot Status',
      new Date().toISOString(),
      'Test'
    ];
    
    sheet.appendRow(testRow);
    console.log('✅ Sheet writing successful');
    
    // Test 4: Test email functionality
    console.log('🧪 Testing email functionality...');
    const testData = {
      orderNumber: 'TEST-' + Date.now(),
      fullName: 'Test Customer',
      phone: '9999999999',
      email: 'test@example.com',
      address: 'Test Address',
      product: 'Test Product',
      quantity: '1',
      totalAmount: '100',
      orderStatus: 'Test Status',
      formattedTimestamp: new Date().toLocaleString('en-IN')
    };
    
    const emailResult = sendEmailNotification(testData);
    console.log('✅ Email test result:', emailResult);
    
    console.log('🎉 All tests completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.stack);
    return false;
  }
}

/**
 * Simple test for debugging POST requests
 */
function testPostHandling() {
  console.log('🧪 Testing POST request handling...');
  
  const mockPostData = {
    postData: {
      type: 'application/json',
      contents: JSON.stringify({
        orderNumber: 'TEST-POST-' + Date.now(),
        fullName: 'Test Customer',
        phone: '9999999999',
        email: 'test@example.com',
        address: 'Test Address',
        product: 'Test Product',
        quantity: '1',
        totalAmount: '100',
        orderStatus: 'Test Status',
        timestamp: new Date().toISOString(),
        formattedTimestamp: new Date().toLocaleString('en-IN')
      })
    }
  };
  
  try {
    const result = doPost(mockPostData);
    console.log('✅ POST handling test successful');
    console.log('Result:', result.getContent());
    return true;
  } catch (error) {
    console.error('❌ POST handling test failed:', error);
    return false;
  }
}

/**
 * Force add a test row to debug sheet access
 */
function forceAddTestRow() {
  console.log('🧪 Force adding test row to debug sheet access...');
  
  try {
    const sheet = getOrCreateOrdersSheet();
    console.log('✅ Got sheet:', sheet.getName());
    
    const testRow = [
      'FORCE-TEST-' + Date.now(),
      new Date().toLocaleString('en-IN'),
      new Date().toLocaleDateString('en-IN'),
      new Date().toLocaleTimeString('en-IN'),
      'Force Test Customer',
      '9999999999',
      'force@test.com',
      'Force Test Address',
      'Force Test Product',
      '1',
      '100',
      'Force test notes',
      'Force Test Status',
      'Force Test',
      'Force Script Test',
      '', '', '', '', 'Force Test Action',
      'Force Test Screenshot Status',
      new Date().toISOString(),
      'Force Test Complete'
    ];
    
    console.log('📝 Adding test row:', testRow.slice(0, 5));
    
    const beforeRows = sheet.getLastRow();
    console.log('📊 Rows before adding:', beforeRows);
    
    sheet.appendRow(testRow);
    
    const afterRows = sheet.getLastRow();
    console.log('📊 Rows after adding:', afterRows);
    
    if (afterRows > beforeRows) {
      console.log('✅ Force test row added successfully!');
      return true;
    } else {
      console.log('❌ Row count did not increase');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Force test failed:', error);
    return false;
  }
}

/**
 * Check sheet permissions and properties
 */
function checkSheetPermissions() {
  console.log('🔍 Checking sheet permissions and properties...');
  Logger.log('🔍 Checking sheet permissions and properties...');
  
  try {
    const sheet = getOrCreateOrdersSheet();
    const spreadsheet = sheet.getParent();
    
    console.log('📋 Sheet name:', sheet.getName());
    Logger.log('📋 Sheet name: ' + sheet.getName());
    
    console.log('📊 Sheet ID:', spreadsheet.getId());
    Logger.log('📊 Sheet ID: ' + spreadsheet.getId());
    
    console.log('🔗 Sheet URL:', spreadsheet.getUrl());
    Logger.log('🔗 Sheet URL: ' + spreadsheet.getUrl());
    
    console.log('📏 Current rows:', sheet.getLastRow());
    Logger.log('📏 Current rows: ' + sheet.getLastRow());
    
    console.log('📐 Current columns:', sheet.getLastColumn());
    Logger.log('📐 Current columns: ' + sheet.getLastColumn());
    
    console.log('👤 Owner email:', spreadsheet.getOwner()?.getEmail());
    Logger.log('👤 Owner email: ' + (spreadsheet.getOwner()?.getEmail() || 'Unknown'));
    
    console.log('✏️ Can edit:', spreadsheet.canEdit());
    Logger.log('✏️ Can edit: ' + spreadsheet.canEdit());
    
    return true;
    
  } catch (error) {
    console.error('❌ Permission check failed:', error);
    Logger.log('❌ Permission check failed: ' + error.toString());
    return false;
  }
}

/**
 * Simple logger test to check if logging works
 */
function testLogger() {
  console.log('🧪 Testing console.log...');
  Logger.log('🧪 Testing Logger.log...');
  
  console.log('✅ Console logging works!');
  Logger.log('✅ Logger logging works!');
  
  const testObject = {
    message: 'Test object',
    timestamp: new Date().toISOString(),
    number: 12345
  };
  
  console.log('📦 Test object with console:', testObject);
  Logger.log('📦 Test object with Logger: ' + JSON.stringify(testObject));
  
  return true;
}

/**
 * Test the doPost function with a mock request
 */
function testDoPostWithMockRequest() {
  console.log('🧪 Testing doPost with mock request...');
  Logger.log('🧪 Testing doPost with mock request...');
  
  const mockEvent = {
    parameter: {},
    postData: {
      type: 'application/json',
      contents: JSON.stringify({
        orderNumber: 'MOCK-TEST-' + Date.now(),
        fullName: 'Mock Test Customer',
        phone: '9999999999',
        email: 'mock@test.com',
        address: 'Mock Test Address',
        product: 'Mock Test Product',
        quantity: '1',
        totalAmount: '100',
        orderStatus: 'Mock Test Order',
        timestamp: new Date().toISOString(),
        formattedTimestamp: new Date().toLocaleString('en-IN')
      })
    }
  };
  
  try {
    console.log('📤 Sending mock request to doPost...');
    Logger.log('📤 Sending mock request to doPost...');
    
    const result = doPost(mockEvent);
    const responseContent = result.getContent();
    
    console.log('✅ doPost executed successfully');
    Logger.log('✅ doPost executed successfully');
    
    console.log('📄 Response:', responseContent);
    Logger.log('📄 Response: ' + responseContent);
    
    return true;
    
  } catch (error) {
    console.error('❌ doPost test failed:', error);
    Logger.log('❌ doPost test failed: ' + error.toString());
    return false;
  }
}

/**
 * Update existing order with WhatsApp confirmation details
 */
function updateExistingOrder(sheet, data) {
  try {
    console.log('🔍 Searching for existing order:', data.orderNumber);
    Logger.log('🔍 Searching for existing order: ' + data.orderNumber);
    
    const lastRow = sheet.getLastRow();
    const orderNumberColumn = 1; // Order Number is in column A
    
    // Search for the order number in the sheet
    const range = sheet.getRange(2, orderNumberColumn, lastRow - 1, 1); // Skip header row
    const values = range.getValues();
    
    let foundRow = -1;
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === data.orderNumber) {
        foundRow = i + 2; // +2 because getRange starts from row 2, and we need 1-based indexing
        break;
      }
    }
    
    if (foundRow > 0) {
      console.log('✅ Found existing order at row:', foundRow);
      Logger.log('✅ Found existing order at row: ' + foundRow);
      
      // Update WhatsApp-related columns
      // Columns: WhatsApp Click Time (18), WhatsApp Click Date (19), Action (20)
      sheet.getRange(foundRow, 18).setValue(data.whatsappClickTimeFormatted || new Date().toLocaleTimeString('en-IN'));
      sheet.getRange(foundRow, 19).setValue(data.whatsappClickDate || new Date().toLocaleDateString('en-IN'));
      sheet.getRange(foundRow, 20).setValue(data.action || 'Confirm Order via WhatsApp');
      
      // Update order status and screenshot status
      sheet.getRange(foundRow, 13).setValue('WhatsApp Confirmation Initiated'); // Order Status
      sheet.getRange(foundRow, 21).setValue('To be sent via WhatsApp'); // Screenshot Status
      
      console.log('✅ Order updated with WhatsApp confirmation details');
      Logger.log('✅ Order updated with WhatsApp confirmation details');
      
      return { success: true, row: foundRow };
    } else {
      console.log('❌ Order not found:', data.orderNumber);
      Logger.log('❌ Order not found: ' + data.orderNumber);
      return { success: false, message: 'Order not found' };
    }
    
  } catch (error) {
    console.error('❌ Error updating existing order:', error);
    Logger.log('❌ Error updating existing order: ' + error.toString());
    return { success: false, message: error.message };
  }
}

/**
 * Test deployment status
 */
function checkDeploymentStatus() {
  console.log('🔍 Checking Google Apps Script deployment...');
  Logger.log('🔍 Checking Google Apps Script deployment...');
  
  try {
    // Get script properties
    const scriptId = ScriptApp.getScriptId();
    console.log('📋 Script ID:', scriptId);
    Logger.log('📋 Script ID: ' + scriptId);
    
    // Test user permissions
    const userEmail = Session.getActiveUser().getEmail();
    console.log('👤 Current user:', userEmail);
    Logger.log('👤 Current user: ' + userEmail);
    
    // Test spreadsheet access
    const sheet = getOrCreateOrdersSheet();
    console.log('📊 Spreadsheet access: OK');
    Logger.log('📊 Spreadsheet access: OK');
    
    console.log('✅ All deployment checks passed');
    Logger.log('✅ All deployment checks passed');
    
    console.log('🚨 IMPORTANT: Make sure script is deployed as Web App with:');
    console.log('   - Execute as: Me');
    console.log('   - Who has access: Anyone');
    
    Logger.log('🚨 IMPORTANT: Make sure script is deployed as Web App with Execute as: Me, Who has access: Anyone');
    
    return true;
    
  } catch (error) {
    console.error('❌ Deployment check failed:', error);
    Logger.log('❌ Deployment check failed: ' + error.toString());
    return false;
  }
}
