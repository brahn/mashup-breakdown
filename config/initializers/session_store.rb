# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_girltalk_session',
  :secret      => '176b9e58cddfacc534df4dd6dd0663434e8fe7b73bb38a50f4beedf71f1c20310e78e8903ab64485f91842d573ae8b46e69fc51ec43a4a7340916fbc6c5380ba'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
