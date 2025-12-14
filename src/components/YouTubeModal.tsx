interface YouTubeModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function YouTubeModal({ videoUrl, isOpen, onClose }: YouTubeModalProps) {
  if (!isOpen) return null;

  // Extract video ID and timestamp from various YouTube URL formats
  const parseYouTubeUrl = (url: string): { videoId: string | null; startTime: number | null } => {
    let videoId: string | null = null;
    let startTime: number | null = null;

    // Extract timestamp first (before video ID extraction)
    const timestampMatch = url.match(/[?&]t=(\d+)/);
    if (timestampMatch) {
      startTime = parseInt(timestampMatch[1], 10);
    }

    // Extract video ID from various formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        // Clean the video ID - remove any trailing query params
        videoId = match[1].split('?')[0].split('&')[0];
        break;
      }
    }

    return { videoId, startTime };
  };

  const { videoId, startTime } = parseYouTubeUrl(videoUrl);

  if (!videoId) {
    return null;
  }

  // Check if it's a Shorts video
  const isShorts = videoUrl.includes('/shorts/');
  
  // Construct embed URL with proper parameters
  // For Shorts, we need to use a different embed format
  const embedUrl = isShorts
    ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
    : startTime 
      ? `https://www.youtube.com/embed/${videoId}?start=${startTime}&enablejsapi=1&rel=0`
      : `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: '#000',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '90%',
          maxHeight: '90%',
          width: '800px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '28px',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
          }}
        >
          <iframe
            src={embedUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          />
        </div>
      </div>
    </div>
  );
}

