exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Netlify functions are working',
            timestamp: new Date().toISOString(),
            environment: {
                hasEmailHost: !!process.env.EMAIL_HOST,
                hasEmailUser: !!process.env.EMAIL_USER,
                hasEmailPass: !!process.env.EMAIL_PASS,
                hasSiteUrl: !!process.env.SITE_URL
            }
        })
    };
};
