# Запись видео с экрана

## Запуск демки

Тут для сборки используется parceljs, весь код обычный javascript. Для запуска используйте `npm run watch`. Основная логика работы собрана в классах [Recorder](https://github.com/screency/screency/blob/master/src/recorder.js) и [VideoMerge](https://github.com/screency/screency/blob/master/src/video-merge.js). Классы отвязаны от вывода, так что возможно их использовать отдельно от этой демки, только класс VideoMerge требует наличие определенных элементов собранных в div#video-merge-area

## Как это работает

Все построено вокруг `MediaStream` - это комбинированный поток видео с экрана, камеры и аудио с микрофона или с компьютера. `Recorder.start()` запрашивает доступ к устройствам и объеденяет выбранные потоки в один MediaStream и передает в [MediaRecorder](https://developer.mozilla.org/ru/docs/Web/API/MediaRecorder) `Recorder.initMediaRecorder()`. При вызове Recorder.start() можно указать интересующие нас устройства:

```typescript
{
  // запросит так же доуступ к аудиопотоку компьютреа, звук проигрываемый на компьютере попадет в итоговый поток
  enableDesktopAudio?: boolean = false,
  // запросит доступ к микрофону, если микрофон не обнаружен выкинет исключение и отобразится alert
  enableMicAudio?: boolean = false,
  // запросит доступ к камере, так же в случае запрета пользователем или отсутствия устройства будет выкинуто исключеие
  enableWebcam?: boolean = false,
  // включает режим 'картинка-в-картинке' для отображения потока с камеры, в противном случае поток с камеры будет отображет в кружочке слева снизу в углу
  picInPic?: boolean = false,
}
```

При остановке потока, например, если пользователь кликнул на 'STOP', необходимо остановить все запрошенные потоки и сохранить результат. Это происходит в методе `Recorder.stopRecording()`. Остановить необходимо все потоки, не только созданные из разных треков, но и сами источники, т.к. остановка стрима не останавливает источники. 

### События Recorder 

Класс Recorder наследует [EventTarget](https://developer.mozilla.org/ru/docs/Web/API/EventTarget) и позволяет подписаться на следующие события:

- `start` - создается при успешном старте записи и содержит поток с камеры, если включен режим 'картинка-в-картинке', этот поток можно передать в video элемент на странице
- `stop` - создается при остановке пользователем или какой-либо ошибке в процессе записи, сожержит ссылку на записанный поток созданную с помощью [URL.createObjectURL()](https://developer.mozilla.org/ru/docs/Web/API/URL/createObjectURL)

## Картинка-в-картинке

Режим вывода видео в отдельное [окно](https://css-tricks.com/an-introduction-to-the-picture-in-picture-web-api/)

## MediaStream

Современные браузеры имеют возможность захвата потока видео или аудио с доступных устройств посредством [MediaDevices.getDisplayMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) и [MediaDevices.getUserMedia()](https://developer.mozilla.org/ru/docs/Web/API/MediaDevices/getUserMedia). Вызов методов запрашивает у пользователя разрешения доступа к устройствам. При вызове возвращается `Promise` с [MediaStream](https://developer.mozilla.org/ru/docs/Web/API/MediaStream), который содержит разные треки [MediaStreamTrack](https://developer.mozilla.org/ru/docs/Web/API/MediaStreamTrack). Это могут быть аудио или видео треки. Доступ у ним можно получить вызвав метод [MediaStream.getTracks()](https://developer.mozilla.org/ru/docs/Web/API/MediaStream/getTracks).

## Наложение видео с камеры 

Если запрошена камера и отключен режим 'картинка-в-картинке', то видеопотоки накладываются с помощью canvas. Класс VideoMerge накладывает потоки через вызов метода `VideoMerge.addWebcam(stream)` и `VideoMerge.addDisplay(stream)`. Сначала передаем стрим в экрана и затем с камеры, первый стрим задаст размер для canvas и FPS отрисовки. 

Можно задать размер и положение вывода камеры:

- `webcamRatio` - радиус кружочка камеры относительно ширины видео, задается как float, например 0.1 означает 10% от ширины
- `webcamMargin` - задает отступ от края canvas в пикселях

После того как все стримы добавлены, вызов метода `VideoMerge.start()` начнет отрисовку кадров с помощью [CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/ru/docs/Web/API/CanvasRenderingContext2D/drawImage). Он позволяет отображать кадры с элемента video, поэтому переданные стримы выводятся в скрытые video:

```javascript
this.webcamVideo.srcObject = stream;
```

`start()` возвращает MediaStream, который дальше используется для создания общего потока, стрим получить можно с canvas'a вызвав [canvas.captureStream](https://developer.mozilla.org/ru/docs/Web/API/HTMLCanvasElement/captureStream)
