GOOGLE_ANALYTICS_ID = "UA-19852315-1"
BLOG_URL_BASE = "http://blog.mashupbreakdown.com"

if RAILS_ENV == "production"
  SHOW_ARTISTS_AND_ALBUMS = false
else
  SHOW_ARTISTS_AND_ALBUMS = true
end
