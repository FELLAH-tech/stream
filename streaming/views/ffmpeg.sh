# ffmpeg -re -i Capturevidéo2.mkv -map 0 -map 0 -c:a aac -c:v libx264 \
# -b:v:0 800k -b:v:1 300k -s:v:1 320x170 -profile:v:1 baseline \
# -profile:v:0 main -bf 1 -keyint_min 120 -g 120 -sc_threshold 0 \
# -b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1 \
# -window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a" \
# -f dash out.mpd

# ffmpeg -y -i sample.mp4 \
#   -c:v libx264 -x264opts "keyint=24:min-keyint=24:no-scenecut" -r 24 \
#   -c:a aac -b:a 128k \
#   -bf 1 -b_strategy 0 -sc_threshold 0 -pix_fmt yuv420p \
#   -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
#   -b:v:0 250k  -filter:v:0 "scale=-2:240" -profile:v:0 baseline \
#   -b:v:1 750k  -filter:v:1 "scale=-2:480" -profile:v:1 main \
#   -b:v:2 1500k -filter:v:2 "scale=-2:720" -profile:v:2 high \
#   sample2.mp4

#   ffmpeg -y -re -i sample2.mp4 \
#   -map 0 \
#   -use_timeline 1 -use_template 1 -window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a" \
#   -f dash sample.mpd
# mkdir 360;
# mkdir 480;
# mkdir 720;
path=$1;
cd ./views/uploads/$path;
ffmpeg -i $path \
  -map 0:v:0 -map 0:a\?:0 -map 0:v:0 -map 0:a\?:0 -map 0:v:0 -map 0:a\?:0 \
  -b:v:0 250k  -filter:v:0 "scale=-2:240" -profile:v:0 baseline \
  -b:v:1 750k  -filter:v:1 "scale=-2:480" -profile:v:1 main \
  -b:v:2 1500k -filter:v:2 "scale=-2:720" -profile:v:2 high \
  -b:v:3 5000k -filter:v:2 "scale=-2:1080" -profile:v:3 high10 \
  -use_timeline 1 -use_template 1 -segment_time 2 -adaptation_sets "id=0,streams=v  id=1,streams=a" \
  -f dash output.mpd

# ffmpeg -i test.mp4 \
#   -map 0:v:0 -map 0:a\?:0 -map 0:v:0 -map 0:a\?:0 -map 0:v:0 -map 0:a\?:0 \
#   -b:v:1 1500k -c:v:1 libx264 -filter:v:1 "scale=480:-1" -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" \
#   -use_timeline 1 -use_template 1 -segment_time 10 -adaptation_sets "id=0,streams=v  id=1,streams=a" \
#   -f dash 480/output.mpd

# ffmpeg -i test.mp4 \
#   -map 0:v:0 -map 0:a\?:0 -map 0:v:0 -map 0:a\?:0 -map 0:v:0 -map 0:a\?:0 \
#   -b:v:2 5000k -c:v:2 libx264 -filter:v:2 "scale=720:-1" -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2"\
#   -use_timeline 1 -use_template 1 -segment_time 10 -adaptation_sets "id=0,streams=v  id=1,streams=a" \
#   -f dash 720/output.mpd