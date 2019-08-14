require "json"
require "mumuki/emojis/version"

module Mumuki
  module Emojis
    class Engine < ::Rails::Engine
    end if defined? ::Rails::Engine

    ASSETS_PATH = File.join(__dir__, '..', '..', 'app', 'assets')

    EMOJIS = JSON.parse(File.read(File.join(ASSETS_PATH, 'json', 'mumuki-emojis-shortnames.json')))

    def self.assets_path_for(asset)
      File.join ASSETS_PATH, asset
    end
  end
end
