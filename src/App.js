import React, { useState, useEffect } from 'react';
import API from './services/API';

import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Modal from './components/Modal';
import Button from './components/Button';
import { TailSpin } from 'react-loader-spinner';
import { Toaster, toast } from 'react-hot-toast';
import css from './components/Loader/Loader.module.css';

function App() {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImg, setSelectedImg] = useState('');

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const fetchImages = async () => {
      try {
        const api = await API.fetchImages({ searchQuery, page });
        if (api.length === 0) {
          return setError(true);
        }
        setImages(prevImages => [...prevImages, ...api]);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [searchQuery, page]);

  const getImages = () => {
    setLoading(true);
    setPage(page => page + 1);
  };

  useEffect(() => {
    const scroll = () => {
      window.scrollBy({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    };

    if (page > 1) {
      scroll();
    }
  }, [images, page]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSelectImage = image => {
    setSelectedImg(image);
    toggleModal();
  };

  const handleSubmit = query => {
    setImages([]);
    setSearchQuery(query);
    setPage(1);
    setError(null);
    setLoading(true);
  };

  return (
    <>
      <Searchbar onSubmit={handleSubmit} />
      <Toaster />
      {error && toast.error('Error')}
      {loading && (
        <div className={css.loader}>
          <TailSpin
            height={80}
            width={80}
            color="#00BFFF"
            ariaLabel="tail-spin-loading"
            radius={1}
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            timeout={5000}
          />
        </div>
      )}
      <ImageGallery images={images} onSelect={handleSelectImage} />
      {images.length > 0 && <Button fetchImages={getImages} />}
      {showModal && <Modal onClose={toggleModal} largeImageURL={selectedImg} />}
    </>
  );
}

export default App;
