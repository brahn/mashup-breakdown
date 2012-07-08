class ContentController < ApplicationController

  private

  # XXX this is clearly the wrong place for this
  def get_share_text_and_meta_data(album_id = 'all-day')
    artist, album_title = case album_id
      when "all-day", "all-day-youtube"
        ["Girl Talk", "All Day"]
      when "aphrodisiac"
        ["Edit Undo", "Aphrodisiac"]
      when "autobob-pop"
        ["DJ AutoBoB", "AutoBoB Pop"]
      when "culture-shock"
        ["Titus Jones", "Culture Shock"]
      when "dhbjptf"
        ["Ithaca Audio", "Don't Hold Back, just Push Things Forward"]
      when "feed-the-animals", "feed-the-animals-video"
        ["Girl Talk", "Feed the Animals"]
      when "for-west-haven"
        ["KTHRSIS", "For West Haven"]
      when "gimme-intros"
        ["CROSSHATCH", "Gimme Intros"]
      when "hdmdml"
        ["The Abrahammer", "How Dubstep Music Destroyed My Life"]
      when "mass-rsrction-7"
        ["scntfc", "mass.rsrction.7"]
      when "nhh"
        ["The Klepstones", "A Night at the Hip-Hopera"]
      when "night-ripper"
        ["Girl Talk", "Night Ripper"]
      when "oldskool"
        ["Trial & Error", "OldSkool Mashup"]
      when "rolling-in-the-beats"
        ["Ithaca Audio", "Rolling in the Beats"]
      when "smokeshow"
        ["E-603", "Smokeshow"]
      when "summer-style"
        ["DJ 0dH", "The Summer Style LP"]
      when "torn-up"
        ["E-603", "Torn Up"]
      when "uspop2009", "uspop2009-editable"
        ["DJ Earworm", "United States of Pop 2009"]
      when "uspop2010", "uspop2010-editable"
        ["DJ Earworm", "United States of Pop 2010"]
      when "whiskey-glitch"
        ["Montauk Hustle Club", "Whiskey Glitch EP"]
      when "one-hit-wonder"
        ["DJ Topsider", "One-Hit Wonder"]
      when "for-west-haven"
        ["KTHRSIS", "For West Haven"]
      when "2011-aftermash"
        ["DJ McFly", "2011: The Aftermash"]
      when "falling-up"
        ["Jump Juice", "Falling Up"]
      when "pure-magic"
        ["Bruneaux", "Pure Magic"]
      when "yacht-rock"
        ["DJ Topsider", "Yacht Rock"]
      when "stampede",
        ["Montauk Hustle Club", "Stampede"]
      when 'tip-your-haters'
        ["DJ Whitt", "Tip Your Haters"]
      when 'mixuptape'
        ["Break the Breakdown", "The Mixuptape"]
      when 'the-pod'
        ["The Pod", "The Pod EP"]
      when 'premier-league-2011-2012'
        ["The Bootiful Game", "Premier League 2011-12"]
      when "feast"
        ["Montauk Hustle Club", "Feast"]
      when "textbook-samples"
        ["Lamestream", "Textbook Samples"]
      else
        ["", ""]
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
      when "autobob-pop"
        ["DJ AutoBoB's pop mashup masterpiece, now on Mashup Breakdown"]
      when "smokeshow"
        [".@e603's SMOKESHOW, now on Mashup Breakdown"]
      else
        ["#{artist}'s #{album_title}, now on Mashup Breakdown"]
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
