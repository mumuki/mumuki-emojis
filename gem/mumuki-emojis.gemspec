
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "mumuki/emojis/version"

Gem::Specification.new do |spec|
  spec.authors       = ["Federico Scarpa"]
  spec.email         = ["fedescarpa@gmail.com"]

  spec.summary       = "Mumuki Emojis"
  spec.homepage      = "https://github.com/mumuki/mumuki-emojis"
  spec.license       = "MIT"

  spec.files         = Dir["lib/**/*"] + Dir["app/**/*"] + ["Rakefile", "README.md"]
  spec.test_files    = `git ls-files -- {test,spec}/*`.split("\n")

  spec.name          = "mumuki-emojis"
  spec.require_paths = ["lib"]
  spec.version       = Mumuki::Emojis::VERSION

  spec.add_development_dependency "bundler", ">= 1.16", "< 3"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "rspec", "~> 3.0"

  spec.required_ruby_version = '>= 3.0'
end
