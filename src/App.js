import React, { useEffect, useState} from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './Components/MovieRow';
import FeaturedMovie from'./Components/FeaturedMovie';
import Header from './Components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect (() => {
    const loadAll = async () => {
      //pegando lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //pegando o featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();

  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener ('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className='page'>

      <Header black={blackHeader}/>

      {
        featuredData &&
        <FeaturedMovie item={featuredData}/>
      }

      <section className='lists'>
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>
      <footer>
      Copyright&copy;  2020 - by <a href='https://www.linkedin.com/in/guilherme-amorim-dos-santos-souza-8267a0127/' target='_blank' >Guilherme Amorim </a><br/>
      Auxiliado pela <a href='https://b7web.com.br/' target='_blank'>B7Web </a><br/>
      Direitos de imagens para <a href='https://www.netflix.com/br/' target='_blank'> Netflix </a><br/>
      Dados extraidos do <a href='https://www.themoviedb.org/' target='_blank'> Themoviedb.org</a>
      </footer>
      {movieList.length <= 0 &&
      <div className='loading'>
        <img src='https://cdn.lowgif.com/full/ce629026a12a85a7-the-tech-behind-netflix-s-worldwide-expansion-is-a-big-deal-for-the.gif' alt='Carregando'/>
      </div>
      }
    </div>
  )
}