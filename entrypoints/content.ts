// 1. Import the style
import './popup/App.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      onMount(container) {
        // Define how your UI will be mounted inside the container
        const app = document.createElement('p');
        app.textContent = 'Hello world!';
        container.append(app);
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});