class ContentController < ApplicationController

  private

  # XXX this is clearly the wrong place for this
  def get_share_text_and_meta_data(album_id = 'all-day')
    artist = case album_id
      when "all-day", "feed-the-animals", "night-ripper" then "Girl Talk"
      when "nhh" then "The Kleptones"
      when "mass-rsrction-7" then "scntfc"
      when "torn-up" then "E-603"
      when "culture-shock" then "Titus Jones"
      when "hdmdml" then "The Abrahammer"
    end
    album_title = case album_id
      when "all-day" then "All Day"
      when "feed-the-animals" then "Feed the Animals"
      when "night-ripper" then "Night Ripper"
      when "nhh" then "A Night at the Hip-Hopera"
      when "mass-rsrction-7" then "mass.rsrction.7"
      when "torn-up" then "Torn Up"
      when "culture-shock" then "Culture Shock"
      when "hdmdml" then "How Dubstep Music Destroyed My Life"
    end
    tweet_text_options = case album_id
      when "all-day"
        [ "Fascinating visual breakdown of 100s of samples used in Girl Talk's new album",
          "See how Girl Talk's magic works!  Visual breakdown of the new album's 100s of samples"]
      when "feed-the-animals"
        ["Another sweet Girl Talk mashup breakdown, this one of his previous album, Feed the Animals."]
      when "night-ripper"
        ["Girl Talk's Night Ripper, finally on Mashup Breadkown!"]
      when "nhh"
        ["Must see/hear: visual breakdown of the Kleptones' brilliant Queen mashup, A Night at the Hip-Hopera"]
      when "mass-rsrction-7"
        ["More mashup breakdowns! Here's mass.rsrction.7 by mashup artist scntfc."]
      when "torn-up"
        ["Girl Talk fans: check out this breakdown of mega-mashup Torn Up by E-603, with 268 sampled tracks."]
      when "culture-shock"
        ["Dance your a$$ off with Titus Jones' pop mashup Culture Shock.  Complete with visual breakdown"]
      when "hdmdml"
        ["The Abrahammer's latest album, 50 mins of old&new mashed together, now on Mashup Breakdown"]
      else
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
    @is_visualizer = true
  end

  def feedback
    @page_class = "vertical-scroll"
    @meta_title = "Feedback"
    @title = "Feedback / ideas / bug reports"
  end

end
