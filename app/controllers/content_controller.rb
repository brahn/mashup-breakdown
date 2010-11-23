class ContentController < ApplicationController

  def visualizer
    @meta_title = "Girl Talk - All Day"
    @title = "All Day by Girl Talk - Mashup Breakdown"
    @page_class = "viewport-size"
  end

  def feedback
    @meta_title = "Feedback"
    @title = "Feedback / ideas / bug reports"
  end

end
