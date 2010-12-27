var ALBUM_SEEDS = [
  { id: "uspop2009",
    featureVideo: true,
    editable: true,
    artist: "DJ Earworm",
    title: "United States of Pop 2009",
    mediaType: "youtube",
    tracks: [{ytId: "iNzrwh2Z2hQ"}],
    sampleDataSources: [{
      id: "blank",
      type: "text",
      url: "/data/uspop2009-blank.txt"
    }],
    links: [{
      title: "Artist Info",
      url: "http://djearworm.com"
    }, {
      title: "YouTube Channel",
      url: "http://youtube.com/djearworm"
    }]
  },
  { id: "nhh",
    artist: "The Kleptones",
    title: "A Night at the Hip-Hopera",
    mediaType: "soundcloud",
    tracks: [
      {scUrl: "http://soundcloud.com/brahn/01-precession", duration: 127},
      {scUrl: "http://soundcloud.com/brahn/02-see", duration: 254},
      {scUrl: "http://soundcloud.com/brahn/03-live", duration: 190},
      {scUrl: "http://soundcloud.com/brahn/04-bite", duration: 242},
      {scUrl: "http://soundcloud.com/brahn/05-jazz", duration: 288},
      {scUrl: "http://soundcloud.com/brahn/06-rock", duration: 165},
      {scUrl: "http://soundcloud.com/brahn/07-love", duration: 31},
      {scUrl: "http://soundcloud.com/brahn/08-fight", duration: 200},
      {scUrl: "http://soundcloud.com/brahn/09-fuck", duration: 69},
      {scUrl: "http://soundcloud.com/brahn/10-play", duration: 221},
      {scUrl: "http://soundcloud.com/brahn/11-ride", duration: 191},
      {scUrl: "http://soundcloud.com/brahn/12-sniff", duration: 260},
      {scUrl: "http://soundcloud.com/brahn/13-ridicule", duration: 37},
      {scUrl: "http://soundcloud.com/brahn/14-plan", duration: 289},
      {scUrl: "http://soundcloud.com/brahn/15-break", duration: 191},
      {scUrl: "http://soundcloud.com/brahn/16-listen", duration: 240},
      {scUrl: "http://soundcloud.com/brahn/17-work", duration: 142},
      {scUrl: "http://soundcloud.com/brahn/18-come", duration: 266},
      {scUrl: "http://soundcloud.com/brahn/19-expose", duration: 195},
      {scUrl: "http://soundcloud.com/brahn/20-jerk", duration: 304},
      {scUrl: "http://soundcloud.com/brahn/21-save", duration: 253},
      {scUrl: "http://soundcloud.com/brahn/22-stop", duration: 209},
      {scUrl: "http://soundcloud.com/brahn/23-question", duration: 329}
    ],
    sampleDataSources: [
      { id: "artist-data",
        prettyText: "courtesy of the artist",
        type: "text",
        url: "/data/nhh-tracks.txt"
      }
    ],
    links: [{
      title: "Artist Info and Download",
      url: "http://www.kleptones.com/pages/downloads_hiphopera.html"
    }]
  },
  { id: "mass-rsrction-7",
    artist: "scntfc",
    title: "mass.rsrction.7",
    mediaType: "soundcloud",
    tracks: [
      { scUrl: "http://soundcloud.com/scientificamerican/mass-rsrction-7",
        duration: 2054}
    ],
    sampleDataSources: [
      { id: "artist-data",
        prettyText: "courtesy of the artist",
        type: "text",
        url: "/data/mass.rsrction.7.txt"
      }
    ],
    links: [{
      title: "Artist Info",
      url: "http://strongforthefuture.com"
    }, {
      title: "Download",
      url: "http://strongforthefuture.com/?page_id=156"
    }]
  },
  { id: "all-day",
    artist: "Girl Talk",
    title: "All Day",
    mediaType: "youtube",
    tracks: [
      {ytId: "4bMM7tGV9MI", duration: 339},
      {ytId: "FtsxfquYHf0", duration: 389},
      {ytId: "xVmXXWcfitw", duration: 323},
      {ytId: "Ka3GznTXur8", duration: 382},
      {ytId: "DZu_lLGFDtM", duration: 362},
      {ytId: "lzf8NNF1Af4", duration: 309},
      {ytId: "MRCEgD1nRRM", duration: 333},
      {ytId: "Nr2cfwR0roU", duration: 398},
      {ytId: "9DBmMoW5lSs", duration: 383},
      {ytId: "p1pd69r1Il8", duration: 348},
      {ytId: "i0yY0zxk-18", duration: 388},
      {ytId: "Bo5bBq2j2EE", duration: 311}
    ],
    sampleDataSources: [
      { id: "wikipedia-snapshot",
        prettyText: "from Wikipedia (Dec. 9)",
        type: "text",
        url: "/data/all-day.txt"
      },
/*
      { id: "wikipedia-live",
        prettyText: "Wikipedia (live)",
        type: "wikipedia",
        pageName: "All_Day_(album)"
      }
*/
    ],
    links: [
      { title: "Artist Info",
        url: "http://www.facebook.com/girltalkmusic"
      },
      { title: "Download",
        url: "http://illegal-art.net/allday/"
      }
    ]
  },
  { id: "feed-the-animals",
    artist: "Girl Talk",
    title: "Feed the Animals",
    mediaType: "soundcloud",
    tracks: [
      {scUrl: "http://soundcloud.com/brahn/01-play-your-part-pt-1", duration: 285},
      {scUrl: "http://soundcloud.com/brahn/02-shut-the-club-down", duration: 187},
      {scUrl: "http://soundcloud.com/brahn/03-still-here", duration: 237},
      {scUrl: "http://soundcloud.com/brahn/04-what-its-all-about", duration: 255},
      {scUrl: "http://soundcloud.com/brahn/05-set-it-off", duration: 222},
      {scUrl: "http://soundcloud.com/brahn/06-no-pause", duration: 192},
      {scUrl: "http://soundcloud.com/brahn/07-like-this", duration: 201},
      {scUrl: "http://soundcloud.com/brahn/08-give-me-a-beat", duration: 252},
      {scUrl: "http://soundcloud.com/brahn/09-hands-in-the-air", duration: 260},
      {scUrl: "http://soundcloud.com/brahn/10-in-step", duration: 203},
      {scUrl: "http://soundcloud.com/brahn/11-let-me-see-you-1", duration: 244},
      {scUrl: "http://soundcloud.com/brahn/12-heres-the-thing-1", duration: 286},
      {scUrl: "http://soundcloud.com/brahn/13-dont-stop-1", duration: 178},
      {scUrl: "http://soundcloud.com/brahn/14-play-your-part-pt-2-1", duration: 205}
    ],
    sampleDataSources: [
      { id: "wikipedia-snapshot",
        prettyText: "from Wikipedia (Dec. 8)",
        type: "text",
        url: "/data/feed-the-animals.txt"
      },
/*
      { id: "wikipedia-live",
        prettyText: "Wikipedia (live)",
        type: "wikipedia",
        pageName: "Feed_the_Animals"
      }
*/
    ],
    links: [
      { title: "Artist Info",
        url: "http://www.facebook.com/girltalkmusic"
      },
      { title: "Download",
        url: "http://illegal-art.net/shop#release117"
      }
    ]
  },
  { id: "feed-the-animals-video",
    featureVideo: true,
    artist: "Girl Talk",
    title: "Feed the Animals",
    mediaType: "youtube",
    tracks: [
      {ytId: "hkih8Q6y6UA", duration: 285},
      {ytId: "OBD98Oeim4k", duration: 187},
      {ytId: "LBQb_nvmecA", duration: 237},
      {ytId: "3sjtJM3a5VY", duration: 255},
      {ytId: "vspfl9SYIUs", duration: 222},
      {ytId: "8nf53yhp1TQ", duration: 192},
      {ytId: "MuvyP8yzLUY", duration: 201},
      {ytId: "htctq11zVx0", duration: 252},
      {ytId: "T-Pu3Glff00", duration: 260},
      {ytId: "v3zdcoAePK8", duration: 203},
      {ytId: "9w5YodoJ6nU", duration: 244},
      {ytId: "iHwxUZyWcRY", duration: 286},
      {ytId: "v6MaXIY5uAU", duration: 178},
      {ytId: "YyVtrZ3KHOk", duration: 205} 
    ],
    sampleDataSources: [
      { id: "wikipedia-snapshot",
        prettyText: "from Wikipedia (Dec. 8)",
        type: "text",
        url: "/data/feed-the-animals.txt"
      },
/*
      { id: "wikipedia-live",
        prettyText: "Wikipedia (live)",
        type: "wikipedia",
        pageName: "Feed_the_Animals"
      }
*/
    ],
    links: [
      { title: "Artist Info",
        url: "http://www.facebook.com/girltalkmusic"
      },
      { title: "Download",
        url: "http://illegal-art.net/shop#release117"
      }
    ]
  }

];

var getAlbumSeedById = function (id) {
  for (var i = 0; i < ALBUM_SEEDS.length; i +=1) {
    if (ALBUM_SEEDS[i].id === id) {
      return ALBUM_SEEDS[i];
    }
  }
  return null;
};

