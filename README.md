

# App Manifest Sample
```yaml
display_information:
  name: Slack Bot Sample
  description: Slack Bot Sample
  background_color: "#0c2b22"
features:
  bot_user:
    display_name: slack-bot-sample
    always_online: false
  slash_commands:
    - command: /open_dialog
      url: https://********.execute-api.********.amazonaws.com/api/slack/commands/open_dialog
      description: open dialog
      should_escape: false
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - channels:history
      - chat:write
      - files:read
      - commands
settings:
  event_subscriptions:
    request_url: https://********.execute-api.********.amazonaws.com/api/slack/events
    bot_events:
      - app_mention
  interactivity:
    is_enabled: true
    request_url: https://********.execute-api.********.amazonaws.com/api/
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```
