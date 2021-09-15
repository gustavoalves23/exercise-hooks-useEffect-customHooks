import React, { useContext, useEffect } from 'react';

import Posts from './components/Posts';
import Selector from './components/Selector';
import { Context } from './components/RedditContext';

function App () {
  const context = useContext(Context);

  useEffect(() => {
    const { fetchPosts } = context;
    fetchPosts();
  }, []);

  function renderLastUpdatedAt() {
    const { selectedSubreddit, postsBySubreddit } = context;
    const { lastUpdated } = postsBySubreddit[selectedSubreddit];

    if (!lastUpdated) return null;

    return (
      <span>
        {`Last updated at ${new Date(lastUpdated).toLocaleTimeString()}.`}
      </span>
    );
  }

  function renderRefreshButton() {
    const { isFetching, refreshSubreddit } = context;

    if (isFetching) return null;

    return (
      <button
        type="button"
        onClick={(event) => refreshSubreddit(event)}
        disabled={isFetching}
      >
        Refresh
      </button>
    );
  }

    const { selectedSubreddit, postsBySubreddit, isFetching } = context;
    const { items: posts = [] } = postsBySubreddit[selectedSubreddit];
    const isEmpty = posts.length === 0;

    return (
      <div>
        <Selector />
        <div>
          {renderLastUpdatedAt()}
          {renderRefreshButton()}
        </div>
        {isFetching && <h2>Loading...</h2>}
        {!isFetching && isEmpty && <h2>Empty.</h2>}
        {!isFetching && !isEmpty && <Posts />}
      </div>
    );
}

App.contextType = Context;

export default App;