import './css/styles.css';
import ImagesApiService from './image-service';
import LoadMoreBtn from './load-more-btn';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// new SimpleLightbox('.gallery a', {captions:true, captionSelector:'img', captionType:'attr', captionsData:'alt',captionPosition:'bottom', captionDelay:250});

var lightbox = new SimpleLightbox('.gallery a', { /* options */ });


const refs = {
    searchForm: document.querySelector('.search-form'),
    imagesList: document.querySelector('.gallery')
};

const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden:true,
});

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', fetchImages);

function onSearch(e) {
    e.preventDefault();  
    clearImagesContainer();

    imagesApiService.query  = e.currentTarget.elements.searchQuery.value;
    
    imagesApiService.resetPage();
    fetchImages();
    
}

async function fetchImages() {
    console.log(imagesApiService.page);
    const images = await imagesApiService.fetchImages();
    // console.log(images);

    if (images.totalHits === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
        if (imagesApiService.page === 2) {
            Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
          }
         if (images.totalHits<=(imagesApiService.page-1)*40) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.hide();
        } else {
            loadMoreBtn.show();
        }
            renderImages(images.hits);
                    
    }
}

function renderImages(images){
    // console.log(images);
    const markup = images.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `
        <div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="450" />
        </a>
        <div class="info">
            <p class="info-item">
            <b>Likes</b>
            ${likes}
            </p>
            <p class="info-item">
            <b>Views</b>
            ${views}
            </p>
            <p class="info-item">
            <b>Comments</b>
            ${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
            ${downloads}
            </p>
        </div>
        </div>
`
    }).join('');

    refs.imagesList.insertAdjacentHTML('beforeend', markup);

    lightbox.refresh();
    
    smoothScrolling();

}

function clearImagesContainer() {
    refs.imagesList.innerHTML = '';
}

function smoothScrolling() {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}