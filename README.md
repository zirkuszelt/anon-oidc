# Anonymous OpenID Connect Provider

allows logging to a service via OpenID Connect with only providing an username

## usage with synapse
```yml

oidc_providers:
  - idp_id: my_idp
    idp_name: "My OpenID provider"
    idp_icon: "mxc://example.com/mediaid"
    issuer: "https://anon-oidc.example.com"
    client_id: "foo"
    client_secret: "bar"
    client_auth_method: client_secret_post
    scopes: ["openid", "profile"]
    skip_verification: true
    user_mapping_provider:
      config:
        localpart_template: "{{ user.sub }}"
        display_name_template: "{{ user.name }}"
```