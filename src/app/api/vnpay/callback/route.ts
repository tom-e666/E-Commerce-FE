import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get all query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    
    // Extract VNPAY parameters
    const vnp_Amount = searchParams.get('vnp_Amount');
    const vnp_BankCode = searchParams.get('vnp_BankCode');
    const vnp_BankTranNo = searchParams.get('vnp_BankTranNo');
    const vnp_CardType = searchParams.get('vnp_CardType');
    const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
    const vnp_PayDate = searchParams.get('vnp_PayDate');
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_TmnCode = searchParams.get('vnp_TmnCode');
    const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
    const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');
    const vnp_SecureHash = searchParams.get('vnp_SecureHash');
    
    // Log the callback data for debugging
    console.log('VNPAY Callback received:', {
      vnp_Amount,
      vnp_BankCode,
      vnp_OrderInfo,
      vnp_ResponseCode,
      vnp_TxnRef,
      vnp_TransactionStatus
    });

    // Create a payment data object to store or process
    const paymentData = {
      orderId: vnp_TxnRef,
      amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0, // VNPAY sends amount × 100
      bankCode: vnp_BankCode,
      bankTransactionNo: vnp_BankTranNo,
      cardType: vnp_CardType,
      orderInfo: vnp_OrderInfo,
      payDate: vnp_PayDate,
      responseCode: vnp_ResponseCode,
      transactionNo: vnp_TransactionNo,
      transactionStatus: vnp_TransactionStatus,
      secureHash: vnp_SecureHash
    };
    // TODO: Verify the secureHash using your VNPAY secret key
    // const isValidHash = verifySecureHash(searchParams, vnp_SecureHash);
    // if (!isValidHash) {
    //   return NextResponse.redirect(new URL('/payment/error?reason=invalid_hash', request.url));
    // }
    // Check if payment was successful
    if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
      // TODO: Update order status in your database
      // await updateOrderPaymentStatus(vnp_TxnRef, 'success', paymentData);
      
      // Redirect to success page
      return NextResponse.redirect(new URL('/payment/success?orderId=' + vnp_TxnRef, request.url));
    } else {
      // Payment failed
      const errorCode = vnp_ResponseCode || 'unknown';
      
      // TODO: Update order status in your database as failed
      // await updateOrderPaymentStatus(vnp_TxnRef, 'failed', paymentData);
      
      // Redirect to failure page
      return NextResponse.redirect(
        new URL(`/payment/failed?orderId=${vnp_TxnRef}&code=${errorCode}`, request.url)
      );
    }
  } catch (error) {
    console.error('Error processing VNPAY callback:', error);
    
    // Redirect to error page
    return NextResponse.redirect(new URL('/payment/error', request.url));
  }
}

// Utility function to verify the VNPAY secure hash - implement based on VNPAY documentation
// function verifySecureHash(params: URLSearchParams, receivedHash: string | null): boolean {
//   // Remove the vnp_SecureHash and vnp_SecureHashType from params (if present)
//   const paramsCopy = new URLSearchParams(params);
//   paramsCopy.delete('vnp_SecureHash');
//   paramsCopy.delete('vnp_SecureHashType');
//
//   // Sort the parameters by key
//   const sortedParams = new URLSearchParams();
//   Array.from(paramsCopy.keys()).sort().forEach(key => {
//     sortedParams.append(key, paramsCopy.get(key) || '');
//   });
//
//   // Create a string with format key1=value1&key2=value2...
//   const queryString = sortedParams.toString();
//
//   // Hash the string with your secret key using HMAC-SHA512
//   // const secretKey = process.env.VNPAY_HASH_SECRET;
//   // const calculatedHash = createHmac('sha512', secretKey)
//   //  .update(queryString)
//   //  .digest('hex');
//
//   // Return true if the calculated hash matches the received hash
//   // return calculatedHash === receivedHash;
//   
//   // For now, return true as a placeholder
//   return true;
// }
