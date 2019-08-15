require "spec_helper"

describe Mumuki::Emojis do
  it { expect(File.exist? Mumuki::Emojis.assets_path_for('json/mumuki-emojis-shortnames.json')).to be true }
  it { expect(File.exist? Mumuki::Emojis.assets_path_for('javascripts/mumuki-emojis.js')).to be true }
  it { expect(File.exist? Mumuki::Emojis.assets_path_for('stylesheets/mumuki-emojis.css')).to be true }
  it { expect(Mumuki::Emojis::EMOJIS.include? 'stuck_out_tongue').to be true }
end
