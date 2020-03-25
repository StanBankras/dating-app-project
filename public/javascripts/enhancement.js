const main = document.querySelector('#main');
const section = document.createElement('section');
section.setAttribute('id', 'viewed-matches')
section.innerHTML = `
  <div class="container">
    <h2>Viewed matches</h2>
    <ul>
    </ul>
  </div>
`;

main.appendChild(section);