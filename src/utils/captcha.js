import Canvas from 'canvas';

export default (opts) => {
  let params = opts;
  if (typeof params === 'string') {
    params = { url: params };
  }
  params.color = params.color || 'rgb(0,100,100)';
  params.background = params.background || 'rgb(255,200,150)';
  const regex = RegExp(params.url);
  return (req, res, next) => {
    if (!regex.test(req.url)) {
      return next();
    }

    const canvas = new Canvas(250, 150);
    const ctx = canvas.getContext('2d');
    ctx.antialias = 'gray';
    ctx.fillStyle = params.background;
    ctx.fillRect(0, 0, 250, 150);
    ctx.fillStyle = params.color;
    ctx.lineWidth = 8;
    ctx.strokeStyle = params.color;
    ctx.font = '80px sans';

    for (let i = 0; i < 2; i++) {
      ctx.moveTo(20, Math.random() * 150);
      ctx.bezierCurveTo(80, Math.random() * 150, 160, Math.random() * 150, 230, Math.random() * 150);
      ctx.stroke();
    }

    const text = ('' + Math.random()).substr(3, 6);

    for (let i = 0; i < text.length; i++) {
      ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, 30 * i + 20, 100);
      ctx.fillText(text.charAt(i), 0, 0);
    }

    canvas.toBuffer(async (err, buf) => {
      if (req.session) {
        req.session.captcha = text;
      }
      res.send(buf);
    });
  };
};
