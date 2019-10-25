---
title: Course Projects
---

{% for project in site.projects %}
<article>
  <header>
    <h2>Project {{ project.number }}: {{ project.title }}</h2>
    <p>Due by {{ project.due_date | date: "%A, %B %-d, %Y"}}</p>
  </header>
  {{ project.content }}
  <h3>Goals</h3>
  <ul>
  {% for goal in project.goals %}
    <li>{{ goal }}</li>
  {% endfor %}
  </ul>
  <h3>Deliverables</h3>
  <ol>
  {% for deliverable in project.deliverables %}
    <li>
      {{ deliverable.description }} {% if deliverable.deadline %}{{ deliverable.deadline }}{% endif %}
    </li>
  {% endfor %}
  </ol>
  <h3>Milestones</h3>
  <ol>
  {% for milestone in project.milestones %}
    <li>{{ milestone.description }} <b>Due by {{ milestone.deadline | date: "%A, %B %-d"}}</b></li>
  {% endfor %}
  </ol>
</article>
{% endfor %}
