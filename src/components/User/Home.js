import '../User/Home.css';
import Header from './Header';

export default function Home() {
    return <>
        <Header/>
        
        <div id="slider-home" class="carousel slide" data-ride="carousel" data-pause="false">
            <ul class="carousel-indicators">
                <li data-target="#slider-home" data-slide-to="0" class="active"></li>
                <li data-target="#slider-home" data-slide-to="1"></li>
                <li data-target="#slider-home" data-slide-to="2"></li>
                <li data-target="#slider-home" data-slide-to="3"></li>
            </ul>
          </div>
    </>
}
