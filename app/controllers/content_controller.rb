class ContentController < ApplicationController

  def visualizer
    @page_class = "viewport-size"
  end

  def feedback
    @meta_title = "Feedback"
    @title = "Feedback / ideas / bug reports"
  end

end
