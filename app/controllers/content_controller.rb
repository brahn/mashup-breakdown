class ContentController < ApplicationController

  private

  # XXX this is clearly the wrong place for this
  def get_share_text_and_meta_data(album_id = 'all-day')
    artist = case album_id
      when "all-day", "feed-the-animals", "night-ripper" then "Girl Talk"
      when "nhh" then "The Kleptones"
      when "mass-rsrction-7" then "scntfc"
      when "torn-up", "smokeshow" then "E-603"
      when "culture-shock" then "Titus Jones"
      when "hdmdml" then "The Abrahammer"
      when "oldskool" then "Trial & Error"
      when "dhbjptf" then "Ithaca Audio"
      when "autobob-pop" then "DJ AutoBoB"
      when "summer-style" then "DJ 0dH"
      when "uspop2010", "uspop2009" then "DJ Earworm"
      when "aphrodisiac" then "Edit Undo"
      when "gimme-intros" then "FatFuck"
      when "whiskey-glitch" then "Montauk Hustle Club"
    end
    album_title = case album_id
      when "all-day" then "All Day"
      when "feed-the-animals" then "Feed the Animals"
      when "night-ripper" then "Night Ripper"
      when "nhh" then "A Night at the Hip-Hopera"
      when "mass-rsrction-7" then "mass.rsrction.7"
      when "torn-up" then "Torn Up"
      when "smokeshow" then "Smokeshow"
      when "culture-shock" then "Culture Shock"
      when "hdmdml" then "How Dubstep Music Destroyed My Life"
      when "oldskool" then "Oldskool Mashup"
      when "dhbjptf" then "Don't Hold Back, just Push Things Forward"
      when "rolling-in-the-beats" then "Rolling in the Beats"
      when "autobob-pop" then "AutoBoB Pop"
      when "summer-style" then "The Summer Style LP"
      when "uspop2010" then "United States of Pop 2010"
      when "uspop2009" then "United States of Pop 2009"
      when "aphrodisiac" then "Aphrodisiac"
      when "gimme-intros" then "Gimme Intros"
      when "whiskey-glitch" then "Whiskey Glitch EP"
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
      when "oldskool"
        ["Trial & Error's Oldskool Mashup, now on Mashup Breakdown"]
      when "dhbjptf"
        ["Don't Hold Back just Push Things Forward, now on Mashup Breakdown"]
      when "rolling-in-the-beats"
        ["Rolling in the Beats, now on Mashup Breakdown"]
      when "autobob-pop"
        ["DJ AutoBoB's pop mashup masterpiece, now on Mashup Breakdown"]
      when "summer-style"
        ["DJ 0dH's Summer Style LP, now on Mashup Breakdown"]
      when "uspop2010"
        ["DJ Earworm's United States of Pop 2010, now on Mashup Breakdown"]
      when "uspop2010"
        ["DJ Earworm's United States of Pop 2009, now on Mashup Breakdown"]
      when "smokeshow"
        [".@e603's SMOKESHOW, now on Mashup Breakdown"]
      when "aphrodisiac"
        ["Edit Undo's Aphrodisiac, now on Mashup Breakdown"]
      when "gimme-intros"
        ["FF's Gimme Intros, now on Mashup Breakdown"]
      when "whiskey-glitch"
        ["Montauk Hustle Club's Whiskey Glitch EP, now on Mashup Breakdown"]
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
