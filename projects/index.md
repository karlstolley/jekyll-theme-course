---
title: Course Projects
---

{% for project in site.projects %}
<article>
  <header>
    <h2>{{ project.title }}</h2>
  </header>
  {{ project.content }}
</article>
{% endfor %}
