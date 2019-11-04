# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-course"
  spec.version       = "0.0.1"
  spec.authors       = ["Karl Stolley"]
  spec.email         = ["karl.stolley@gmail.com"]
  spec.homepage      = "https://stolley.dev/"
  spec.license       = "MIT"

  spec.summary       = "A Jekyll theme for accessible course sites."
  spec.description   = "A data-driven Jekyll theme for accessible, mobile-first course sites."

  spec.metadata      = {
    "bug_tracker_uri" => "https://github.com/karlstolley/jekyll-theme-course/issues",
    "changelog_uri"   => "https://github.com/karlstolley/jekyll-theme-course/releases",
    "documentation_uri" => "https://github.com/karlstolley/jekyll-theme-course/README.md",
    "wiki_uri" => "https://github.com/karlstolley/jekyll-theme-course/wiki",
    "homepage_uri"    => "https://stolley.dev/",
    "source_code_uri" => "https://github.com/karlstolley/jekyll-theme-course"
  }

  spec.required_ruby_version = "~> 2.6"
  spec.files         = `git ls-files -z`.split("\x0").select { |f|
    f.match(%r{^(Gemfile|_config|_data|_layouts|_projects|assets|index|projects)}i) 
  }

  spec.add_runtime_dependency "jekyll", "~> 4.0"

  spec.add_development_dependency "bundler", "~> 1"
  spec.add_development_dependency "rake", "~> 12.3"
end
