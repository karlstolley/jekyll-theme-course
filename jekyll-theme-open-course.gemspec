# coding: utf-8

require_relative "lib/jtoc"

Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-open-course"
  spec.version       = JTOpenCourse::VERSION
  spec.authors       = ["Karl Stolley"]
  spec.email         = ["karl.stolley@gmail.com"]
  spec.homepage      = "https://stolley.dev/"
  spec.license       = "MIT"

  spec.summary       = "A Jekyll theme for accessible course sites."
  spec.description   = "A data-driven Jekyll theme for accessible, mobile-first course sites."

  spec.metadata      = {
    "bug_tracker_uri" => "https://github.com/karlstolley/jekyll-theme-open-course/issues",
    "changelog_uri"   => "https://github.com/karlstolley/jekyll-theme-open-course/releases",
    "documentation_uri" => "https://github.com/karlstolley/jekyll-theme-open-course/README.md",
    "wiki_uri" => "https://github.com/karlstolley/jekyll-theme-open-course/wiki",
    "homepage_uri"    => "https://stolley.dev/",
    "source_code_uri" => "https://github.com/karlstolley/jekyll-theme-open-course"
  }

  spec.required_ruby_version = "~> 2.6"
  all_files = Dir.glob("**/*")
  spec.files = all_files.grep(%r{^(Gemfile|_config|_data|_layouts|_projects|assets|exe|index|lib|projects)}i)
  spec.bindir = "exe"
  spec.executables = ["jtoc"]

  spec.add_runtime_dependency "jekyll", "~> 4.0"

  spec.add_development_dependency "bundler", "~> 1"
  spec.add_development_dependency "rake", "~> 12.3"
end
