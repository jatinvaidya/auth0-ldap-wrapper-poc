const ldap = require('ldapjs');
require('dotenv').config()

const server = ldap.createServer();
var ManagementClient = require('auth0').ManagementClient;
var auth0 = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENTID,
    clientSecret: process.env.AUTH0_CLIENTSECRET,
    scope: 'read:users'
});

server.search(process.env.LDAP_BASEDN, async (req, res, next) => {

    console.log(req.filter.toString());
    auth0.getUser({ id: req.filter.value }, (err, auth0User) => {
        if(err) {
            console.error(err.message);
        } else {
        console.log(`auth0User: ${JSON.stringify(auth0User)}`);
        const obj = {
            dn: `uid=${auth0User.user_id},${req.dn.toString()}`,
            attributes: {
                objectclass: ['person', 'top'],
                uid: auth0User.user_id,
                email: auth0User.email,
                givenName: auth0User.given_name,
                sn: auth0User.family_name,
                group: auth0User.app_metadata.groups
            }
        };

        console.log(obj);
        if (req.filter.matches(obj.attributes))
            res.send(obj);
        }
        res.end();
    });
});

server.listen(1389, () => {
    console.log('LDAP server listening at %s', server.url);
});
