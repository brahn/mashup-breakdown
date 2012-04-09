require 'nokogiri'
require 'open-uri'

class SoundcloudPageParser

  attr_reader :doc

  def initialize(url)
     @doc = Nokogiri::HTML(open(url))
  end

  def tracks
    @tracks ||= @doc.css('div.set-player ol.tracks li span.info').map do |span|
      local_path = span.css('a').first['href']
      url = "http://soundcloud.com#{local_path}"

      duration_string_as_float = span.css('span.time').text.to_f
      minutes = (duration_string_as_float.floor).to_i
      seconds = ((duration_string_as_float * 100) % 100).to_i

      title = span.css('a').first.text
      track_num = span.css('span').first.text.gsub(".", "").to_i

      {:scUrl => url, :minutes => minutes, :seconds => seconds, :title => title, :track_num => track_num}
    end
  end

  def pretty_track_url_and_duration
    tracks.each_with_index do |track, index|
      is_last = (index == tracks.length - 1)
      puts("{scUrl: '#{track[:scUrl]}', duration: #{60 * track[:minutes] + track[:seconds]}}" + (is_last ? "" : ","))
    end
    nil
  end

  def pretty_track_number_title_and_duration
    tracks.each do |track|
      puts "#{track[:track_num]}. \"#{track[:title]}\" - #{track[:minutes]}:#{track[:seconds]}"
    end
    nil
  end

  private

  def duration_from_span(span)
  end

end
