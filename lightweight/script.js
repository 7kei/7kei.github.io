const card = (item, color) => `
    <div class="pictochat-message project-card" data-info='${JSON.stringify(item).replace(/'/g, "&#39;")}'>
        <span class="card-date">${item.date}</span>
        <header class="${color}">${item.title}</header>
        <img src="${item.image}" alt="${item.title}" class="project-image">
        ${item.description ? `<p class="desc">${item.description}</p>` : ''}
    </div>`;
const certCard = (item, color) => `
    <div class="pictochat-message project-card" data-info='${JSON.stringify(item).replace(/'/g, "&#39;")}'>
        <header class="${color}">${item.title}</header>
        <img src="${item.image}" alt="${item.title}" class="project-image">
        ${item.date ? `${item.date}` : ''}
        ${item.description ? `<p class="desc">${item.description}</p>` : ''}
    </div>`;

function render(key, data) {
    const section = document.querySelector(`[data-render="${key}"]`);
    if (key === 'certifications') {
        section.insertAdjacentHTML('beforeend', data.map(d => certCard(d, section.dataset.color)).join(''));
    } else {
        section.insertAdjacentHTML('beforeend', data.map(d => card(d, section.dataset.color)).join(''));
    }
}

fetch('data.json')
    .then(r => r.json())
    .then(data => {
        render('projects', data.projects);
        render('certifications', data.certifications);
    });

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxInfo = lightbox.querySelector('.lightbox-info');

document.addEventListener('click', e => {
    const img = e.target.closest('.project-image');
    if (img) {
        const item = JSON.parse(img.parentElement.dataset.info);
        lightboxImg.src = item.image;
        lightboxInfo.innerHTML = `
            <h3>${item.title}</h3>
            ${item.org ? `<p><strong>${item.org}</strong> &bull; ${item.date}</p>` : `<p>${item.date}</p>`}
            ${item.role ? `<p><strong>Role:</strong> ${item.role}</p>` : ''}
            ${item.stack ? `<p><strong>Stack:</strong> ${item.stack}</p>` : ''}
            ${item.credentialId ? `<p><strong>Credential ID:</strong> ${item.credentialId}</p>` : ''}
            ${item.description ? `<p>${item.description}</p>` : ''}
            ${(item.links || []).map(l => `<a href="${l.url}" target="_blank">${l.label}</a>`).join(' &bull; ')}`;
        lightbox.classList.add('is-open');
    } else if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('is-open');
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.classList.remove('is-open');
});
