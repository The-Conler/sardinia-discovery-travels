// Replace questions and answers here; each accordion item opens independently.
const items = [
  { question: 'What makes a project a good fit?', answer: 'Projects with a clear goal, a focused scope, and room for thoughtful creative decisions tend to produce the strongest results.' },
  { question: 'How does the process work?', answer: 'We begin with a conversation about your goals, explore the possibilities, and agree on a clear plan. From there, we develop the work in stages, with time for your feedback along the way.' },
  { question: 'What do you need to get started?', answer: 'A short outline of your idea, your priorities, and any timing or budget considerations is a great starting point. References and existing materials help us understand what you have in mind.' },
  { question: 'When can we begin?', answer: 'Once we have discussed the scope and confirmed availability, we will agree on a start date together. Share your ideal timeline and we can outline the next steps.' }
];
// Right-column timeline; edit the four steps here.
const steps = [
  { title: 'Inquiry', description: 'Tell us about your project, goals, and timeline.' },
  { title: 'Scope', description: 'We align on scope, budget, and the creative direction.' },
  { title: 'Build', description: 'We design and produce the work, with room for feedback.' },
  { title: 'Launch', description: 'We deliver the final assets and help you go live.' }
];
let faqInstance = 0;
class FaqSection extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    const prefix = `faq-${++faqInstance}`;
    root.innerHTML = `<link rel="stylesheet" href="${new URL('./faq.css', import.meta.url)}">
      <section aria-label="Frequently asked questions and how it works">
        <!-- Centered two-column container, separate from the footer. -->
        <div class="container">
          <!-- Left accordion: all items begin closed. -->
          <div class="accordion-column">
            <div class="list"></div>
          </div>
          <!-- Right timeline: semantic ordered steps. -->
          <div class="process" aria-labelledby="${prefix}-process">
            <h2 class="eyebrow" id="${prefix}-process">How it works</h2>
            <ol class="timeline"></ol>
          </div>
        </div>
      </section>`;
    const timeline = root.querySelector('.timeline');
    steps.forEach(({ title, description }, index) => {
      const step = document.createElement('li');
      step.innerHTML = '<span class="marker" aria-hidden="true"></span><div><h3></h3><p></p></div>';
      step.querySelector('.marker').textContent = String(index + 1);
      step.querySelector('h3').textContent = title;
      step.querySelector('p').textContent = description;
      timeline.append(step);
    });
    const list = root.querySelector('.list');
    items.forEach(({ question, answer }, index) => {
      // Item, full-width header button, and decorative plus icon.
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<button id="${prefix}-button-${index}" type="button" aria-expanded="false" aria-controls="${prefix}-answer-${index}"><span class="question"></span><span class="icon" aria-hidden="true"></span></button>
        <!-- The inner wrapper allows grid rows to collapse to zero. -->
        <div class="answer" id="${prefix}-answer-${index}" role="region" aria-labelledby="${prefix}-button-${index}" aria-hidden="true" inert><div class="answer-inner"><p></p></div></div>`;
      item.querySelector('.question').textContent = question;
      item.querySelector('p').textContent = answer;
      const button = item.querySelector('button');
      const region = item.querySelector('.answer');
      // Native button activation handles mouse, touch, Enter, and Space.
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        region.setAttribute('aria-hidden', String(!open));
        region.inert = !open;
        item.classList.toggle('is-open', open);
      });
      list.append(item);
    });
  }
}
if (!customElements.get('faq-section')) customElements.define('faq-section', FaqSection);
