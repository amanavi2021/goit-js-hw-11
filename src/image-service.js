const API_KEY='34990362-54e8377378381fe38c3fa12ad';
const BASE_URL ='https://pixabay.com/api';

export default class ImagesApiService {
    constructor(){
        this.searchQuery='';
        this.page = 1;
    };

    async fetchImages() {
        const searchParams = new URLSearchParams({
            key:API_KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation:'horizontal',
            safesearch:true,
            per_page:40,
        });
       

        const url = `${BASE_URL}/?${searchParams}&page=${this.page}`;
        // console.log(url);
        // return fetch(url)
        // .then(response => {
        //     // console.log(response);
        //     this.incrementPage();
        //     return response.json();
            
        // });   
        
        const response = await fetch(url);
        this.incrementPage();
        const images = await response.json();
        // console.log(images);
        return images;
            
    }

    incrementPage() {
        this.page +=1;
    }

    resetPage() {
        this.page =1;
    }

    get query(){
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery=newQuery;

    }
}