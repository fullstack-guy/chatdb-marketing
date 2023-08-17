import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : null;

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '##171717',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              fontSize: 60,
              color: 'white',
              fontWeight: 'bold',
              marginBottom: 30,
            }}
          >
            ChatDB
          </div>
          {title && (
            <div
              style={{
                fontSize: 100,
                fontStyle: 'normal',
                letterSpacing: '-0.025em',
                color: 'white',
                padding: '0 120px',
                lineHeight: 1.0,
                whiteSpace: 'pre-wrap',
              }}
            >
              {title}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
