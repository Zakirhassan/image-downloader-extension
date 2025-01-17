document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
          chrome.scripting.executeScript(
              {
                  target: { tabId: tabs[0].id },
                  func: fetchImages,
              },
              (result) => {
                  displayImages(result[0].result || []);
              }
          );
      }
  });

  function displayImages(images) {
      const container = document.getElementById('image-container');
      container.innerHTML = ''; // Clear any previous content

      if (images.length === 0) {
          container.textContent = 'No images found';
          return;
      }

      images.forEach(img => {
          if (img.src) { // Check if the image source exists
              const imageItem = document.createElement('div');
              imageItem.className = 'image-item';

              const imageElement = document.createElement('img');
              imageElement.src = img.src;

              const downloadBtn = document.createElement('button');
              downloadBtn.textContent = 'Download';
              downloadBtn.addEventListener('click', () => downloadImage(img.src));

              imageItem.appendChild(imageElement);
              imageItem.appendChild(downloadBtn);
              container.appendChild(imageItem);
          }
      });
  }

  function downloadImage(url) {
      chrome.downloads.download({
          url: url,
          saveAs: true
      });
  }

  function fetchImages() {
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src
      }));
      return images;
  }
});
