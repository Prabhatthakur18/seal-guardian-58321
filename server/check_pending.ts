import db from './src/config/database.js';

async function checkPendingRegistrations() {
    try {
        console.log('=== Checking Database State ===\n');

        // Check pending_registrations table
        const [pending]: any = await db.execute('SELECT id, name, email, role, expires_at FROM pending_registrations');
        console.log('PENDING REGISTRATIONS:', pending.length, 'records');
        if (pending.length > 0) {
            console.log(JSON.stringify(pending, null, 2));
        }

        // Check if test email exists in profiles (should NOT exist)
        const [profiles]: any = await db.execute(
            "SELECT id, name, email FROM profiles WHERE email LIKE '%testdemo%' OR email LIKE '%test%example%'"
        );
        console.log('\nPROFILES with test emails (should be empty if OTP not verified):', profiles.length, 'records');
        if (profiles.length > 0) {
            console.log(JSON.stringify(profiles, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPendingRegistrations();
