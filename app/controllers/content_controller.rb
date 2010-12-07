class ContentController < ApplicationController

  def visualizer
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
