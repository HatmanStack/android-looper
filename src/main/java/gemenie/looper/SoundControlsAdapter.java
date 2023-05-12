package gemenie.looper;

import android.media.MediaPlayer;
import android.media.PlaybackParams;
import android.os.Build;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.SeekBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;


import java.util.ArrayList;


public class SoundControlsAdapter extends RecyclerView.Adapter<SoundControlsAdapter.ViewHolder> {

    private ArrayList<MediaPlayer> mMediaList;
    private ButtonClickListener buttonListener;
    private int MAX_VOLUME = 100;
    private String TrackText = "Track ";

    public SoundControlsAdapter(ArrayList<MediaPlayer> mediaList, ButtonClickListener buttonlistener) {
        mMediaList = mediaList;
        buttonListener = buttonlistener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.sound_controls, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        if(Build.VERSION.SDK_INT <= Build.VERSION_CODES.M) {
            holder.seekBarSpeed.setVisibility(View.GONE);
        }
        holder.seekBarVolume.setProgress(100);
        holder.seekBarSpeed.setProgress(41);
        String text = TrackText + position;
        holder.editText.setText(text);
    }

    @Override
    public int getItemCount() {
        if(mMediaList != null) {
            return mMediaList.size();
        }
        return 0;
    }

    public interface ButtonClickListener{
        void onButtonClick(int clickedposition);
        void currentPosition(int clickedposition);
    }

    class ViewHolder extends RecyclerView.ViewHolder
            implements SeekBar.OnSeekBarChangeListener,
            View.OnClickListener{

        SeekBar seekBarVolume;
        SeekBar seekBarSpeed;
        TextView volumeText;
        TextView speedText;
        TextView editText;

        public ViewHolder(View itemView) {
            super(itemView);
            ImageButton playBtn = itemView.findViewById(R.id.button_play);
            ImageButton pauseBtn = itemView.findViewById(R.id.button_pause);
            ImageButton deleteBtn = itemView.findViewById(R.id.button_delete);
            editText = itemView.findViewById(R.id.editText);
            seekBarVolume = itemView.findViewById(R.id.seekbar_volume);
            seekBarSpeed = itemView.findViewById(R.id.seekbar_speed);
            volumeText = itemView.findViewById(R.id.volume_text);
            speedText = itemView.findViewById(R.id.speed_text);
            playBtn.setOnClickListener(this);
            pauseBtn.setOnClickListener(this);
            deleteBtn.setOnClickListener(this);
            seekBarVolume.setOnSeekBarChangeListener(this);
            seekBarSpeed.setOnSeekBarChangeListener(this);
        }

        @Override
        public void onClick(View view) {
            buttonListener.currentPosition(getAdapterPosition());
            MediaPlayer music = mMediaList.get(getAdapterPosition());
            String tag = view.getTag().toString();
            Log.i(MainActivity.TAG, "adapterPosition: " + getAdapterPosition());
            if (tag.equals("play")) {
                if(!music.isLooping()){
                    music.setLooping(true);
                }
                music.start();
            }
            if (tag.equals("pause")) {
                music.pause();
            }
            if (tag.equals("delete")) {
                buttonListener.onButtonClick(getAdapterPosition());
            }
        }

        @Override
        public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
            buttonListener.currentPosition(getAdapterPosition());
            MediaPlayer music = mMediaList.get(getAdapterPosition());
            String tag = seekBar.getTag().toString();
            if (tag.equals("volume")) {
                if(progress > 0) {
                    volumeText.setText(String.valueOf(progress));
                    final float volume = (float) (1 - (Math.log(MAX_VOLUME - progress) / Math.log(MAX_VOLUME)));
                    Log.i(MainActivity.TAG, "onProgressChanged: Volume: " + progress);
                    music.setVolume(volume, volume);
                }else {
                    music.setVolume(0,0);
                }
            }
            if (tag.equals("speed")) {
                if(progress > 2) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        float speed = (float) progress / 41;
                        String holder = String.format("%.2f", speed);
                        if(holder.equals("2.44")){
                            speedText.setText("2.50");
                        }else {
                            speedText.setText(holder);
                        }
                        Log.i(MainActivity.TAG, "onProgressChanged: Speed: " + holder);
                        music.setPlaybackParams(new PlaybackParams().setSpeed(Float.parseFloat(holder)));
                    }
                }
            }
        }

        @Override
        public void onStartTrackingTouch(SeekBar seekBar) {

        }

        @Override
        public void onStopTrackingTouch(SeekBar seekBar) {

        }
    }
}