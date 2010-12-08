class ContentController < ApplicationController

  private

  # XXX this is clearly the wrong place for this
  def get_share_text_and_meta_data(album_id = 'all-day')
    artist = case album_id
      when "all-day", "feed-the-animals" then "Girl Talk"
      when "nhh" then "The Kleptones"
      when "mass-rsrction-7" then "scntfc"
    end
    album_title = case album_id
      when "all-day" then "All Day"
      when "feed-the-animals" then "Feed the Animals"
      when "nhh" then "A Night at the Hip-Hopera"
      when "mass-rsrction-7" then "mass.rsrction.7"
    end
    tweet_text_options = case album_id
      when "all-day"
        [ "Fascinating visual breakdown of 100s of samples used in Girl Talk's new album",
          "See how Girl Talk's magic works!  Visual breakdown of the new album's 100s of samples"]
      when "feed-the-animals"
        ["Another sweet Girl Talk mashup breakdown, this one of his previous album, Feed the Animals."]
      when "nhh"
        ["Must see/hear: visual breakdown of the Kleptones' brilliant Queen mashup, A Night at the Hip-Hopera"]
      when "mass-rsrction-7"
        ["More mashup breakdowns! Here's mass.rsrction.7 by mashup artist scntfc."]   else
        [""]
      end
    @tweet_text = tweet_text_options[rand tweet_text_options.length]
    @fb_description = @tweet_text
    @meta_title = "#{artist} - #{album_title}"
    @meta_description = "Interactive timeline identifying the samples in " +
      "'#{album_title}' by #{artist}."
  end

  public

  def visualizer
    get_share_text_and_meta_data params[:album_id]
    @page_class = "viewport-size"
    @use_visualizer_js = true
    @is_visualizer = true
  end

  def feedback
    @page_class = "vertical-scroll"
    @meta_title = "Feedback"
    @title = "Feedback / ideas / bug reports"
  end

end
