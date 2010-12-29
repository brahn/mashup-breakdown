class SamplestashController < ApplicationController

  def read_json
    s = Samplestash.last(:conditions => 
      {:album_short_name => params[:album_short_name],
       :track_num => params[:track_num] || 1},
      :order => :created_at)
    if s && s.sample_data.present?
      data = ActiveSupport::JSON.decode(s.sample_data)
      data.symbolize_keys!
    else
      data = {:tracks => [{}],
              :samples => [[]]}
    end
    render :json => data
  end

  def write_json
    s = Samplestash.new(:album_short_name => params[:album_short_name],
      :track_num => params[:track_num] || 1,
      :sample_data => params[:sample_data])
    s.save!
    render :text => "ok"
  end

  def temp
    render :text => "ok"
  end

end
