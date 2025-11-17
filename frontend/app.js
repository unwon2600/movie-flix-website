// frontend/app.js
async function loadMovies() {
  try {
    const res = await fetch('/api/movies');
    if (!res.ok) throw new Error('Server returned ' + res.status);
    const data = await res.json();

    let box = "";
    data.forEach(m => {
      const poster = m.poster || 'https://via.placeholder.com/400x600?text=No+Poster';
      const id = m._id || m.id || '';
      // build quality buttons / links if present
      const qualities = m.qualities || {};
      const qButtons = Object.keys(qualities).map(q => {
        const info = qualities[q] || {};
        return info.direct ? `<a class="download-btn" href="#" data-direct="${info.direct}" data-id="${id}" data-q="${q}">${q} Download</a>` : '';
      }).join('');
      box += `
        <div class='movie-card'>
          <img class='movie-poster' src='${poster}' alt='${m.title}'>
          <h3>${m.title}</h3>
          <div>${qButtons}</div>
          <button onclick="openMovie('${id}')">View</button>
        </div>
      `;
    });

    document.getElementById("movies").innerHTML = box;

    // hook download buttons
    document.querySelectorAll('.download-btn').forEach(a=>{
      a.addEventListener('click', (ev)=>{
        ev.preventDefault();
        const url = a.getAttribute('data-direct');
        if(!url) return alert('No direct link');
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download','');
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      });
    });

  } catch (e) {
    console.error('Load movies failed:', e);
    document.getElementById("movies").innerHTML = "<p>Unable to load movies.</p>";
  }
}

function openMovie(id) {
  // open movie details page or modal; use /api/movies/:id
  window.location.href = `/movie.html?id=${id}`;
}

loadMovies();
