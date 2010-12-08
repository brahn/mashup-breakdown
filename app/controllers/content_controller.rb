class ContentController < ApplicationController

  def visualizer
    artist = case params[:album_id]
      when "all-day", "feed-the-animals" then "Girl Talk"
      when "nhh" then "The Kleptones"
      when "mass-rsrction-7" then "scntfc"
    end
    album_title = case params[:album_id]
      when "all-day" then "All Day"
      when "feed-the-animals" then "Feed the Animals"
      when "nhh" then "A Night at the Hip-Hopera"
      when "mass-rsrction-7" then "mass.rsrction.7"
    end
    @meta_title = "#{artist} - #{album_title}"
    @meta_description = "Interactive timeline identifying the samples in " +
      "'#{album_title}' by #{artist}."
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
