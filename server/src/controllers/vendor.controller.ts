import { Request, Response } from 'express';
import db from '../config/database';
import { EmailService } from '../services/email.service';

export class VendorController {
  static async verifyVendor(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Invalid Token</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px; 
                text-align: center;
                background: #f5f5f5;
              }
              .card {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #dc3545; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>❌ Invalid Verification Token</h1>
              <p>The verification link is invalid or has expired.</p>
            </div>
          </body>
          </html>
        `);
      }

      // Find vendor by token
      const [verifications]: any = await db.execute(
        'SELECT * FROM vendor_verification WHERE verification_token = ?',
        [token]
      );

      if (verifications.length === 0) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Token Not Found</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px; 
                text-align: center;
                background: #f5f5f5;
              }
              .card {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #dc3545; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>❌ Verification Token Not Found</h1>
              <p>This verification link is invalid or has already been used.</p>
            </div>
          </body>
          </html>
        `);
      }

      const verification = verifications[0];

      // Check if already verified
      if (verification.is_verified) {
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Already Verified</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px; 
                text-align: center;
                background: #f5f5f5;
              }
              .card {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #ffc107; }
            </style>
          </head>
          <body>
            <div class="card">
              <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
              <h1>Already Verified</h1>
              <p>This vendor account has already been verified.</p>
            </div>
          </body>
          </html>
        `);
      }

      // Get vendor details BEFORE updating
      const [vendors]: any = await db.execute(
        'SELECT name, email FROM profiles WHERE id = ?',
        [verification.user_id]
      );

      if (vendors.length === 0) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Vendor Not Found</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 50px auto; 
                padding: 20px; 
                text-align: center;
                background: #f5f5f5;
              }
              .card {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #dc3545; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>❌ Vendor Not Found</h1>
              <p>Unable to find vendor details.</p>
            </div>
          </body>
          </html>
        `);
      }

      // Update verification status
      await db.execute(
        'UPDATE vendor_verification SET is_verified = TRUE, verified_at = NOW() WHERE verification_token = ?',
        [token]
      );

      // Send confirmation email to vendor with login link
      await EmailService.sendVendorApprovalConfirmation(
        vendors[0].email,
        vendors[0].name
      );

      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Vendor Verified Successfully</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .card {
              background: white;
              padding: 50px 40px;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
              width: 100%;
              text-align: center;
              animation: slideUp 0.5s ease-out;
            }
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .success-icon { 
              font-size: 80px; 
              margin-bottom: 20px;
              animation: bounce 1s ease infinite;
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            h1 { 
              color: #28a745; 
              margin-bottom: 15px;
              font-size: 28px;
            }
            .subtitle {
              color: #666;
              margin-bottom: 25px;
              font-size: 16px;
              line-height: 1.5;
            }
            .vendor-info {
              background: #f8f9fa;
              border-left: 4px solid #28a745;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
              text-align: left;
            }
            .vendor-info p {
              margin: 8px 0;
              color: #333;
            }
            .vendor-info strong {
              color: #28a745;
            }
            .info-box {
              background: #e7f5ff;
              border: 2px solid #1971c2;
              border-radius: 10px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-box p {
              margin: 5px 0;
              color: #1971c2;
              font-weight: 500;
            }
            .checkmark {
              color: #28a745;
              font-size: 20px;
              margin-right: 8px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #999;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success-icon">✅</div>
            <h1>Vendor Verified Successfully!</h1>
            <p class="subtitle">The vendor account has been approved and activated</p>
            
            <div class="vendor-info">
              <p><strong>Vendor Name:</strong> ${vendors[0].name}</p>
              <p><strong>Email:</strong> ${vendors[0].email}</p>
              <p><strong>Verification Date:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div class="info-box">
              <p><span class="checkmark">✓</span> Account activated successfully</p>
              <p><span class="checkmark">✓</span> Confirmation email sent to vendor</p>
              <p><span class="checkmark">✓</span> Login credentials are now active</p>
            </div>
            
            <div class="footer">
              <p>The vendor has been notified via email with login instructions.</p>
              <p style="margin-top: 10px;">You can safely close this window.</p>
            </div>
          </div>
        </body>
        </html>
      `);
    } catch (error: any) {
      console.error('Vendor verification error:', error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Error</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 600px; 
              margin: 50px auto; 
              padding: 20px; 
              text-align: center;
              background: #f5f5f5;
            }
            .card {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #dc3545; }
            .error-details {
              background: #fff3cd;
              border: 1px solid #ffc107;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div style="font-size: 64px; color: #dc3545; margin-bottom: 20px;">❌</div>
            <h1>Verification Error</h1>
            <p>An error occurred during verification. Please try again later.</p>
            <div class="error-details">
              <strong>Error Details:</strong><br>
              ${error.message || 'Unknown error occurred'}
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              If this problem persists, please contact support.
            </p>
          </div>
        </body>
        </html>
      `);
    }
  }
}