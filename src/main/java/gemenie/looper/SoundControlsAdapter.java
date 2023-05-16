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

    // SoundControlsAdapter class constructor takes an ArrayList of MediaPlayer objects and a ButtonClickListener interface object as parameters
public SoundControlsAdapter(ArrayList<MediaPlayer> mediaList, ButtonClickListener buttonlistener) {
    // Store the passed parameters in the class variables
    mMediaList = mediaList;
    buttonListener = buttonlistener;
}

// onCreateViewHolder() creates and returns a new ViewHolder object when a new list item needs to be displayed
@NonNull
@Override
public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    // Inflate the sound_controls layout to create a new view
    View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.sound_controls, parent, false);
    // Return a new ViewHolder object initialized with the new view
    return new ViewHolder(view);
}

// onBindViewHolder() binds data to the view holder when the view holder is created or updated
@Override
public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
    // Hide the seek bar for speed if the device version is lower than or equal to Android M (Marshmallow)
    if(Build.VERSION.SDK_INT <= Build.VERSION_CODES.M) {
        holder.seekBarSpeed.setVisibility(View.GONE);
    }
    // Set the volume seek bar progress to 100%
    holder.seekBarVolume.setProgress(100);
    // Set the speed seek bar progress to 41
    holder.seekBarSpeed.setProgress(41);
    // Set the EditText text to the string "Track" followed by the position number
    String text = TrackText + position;
    holder.editText.setText(text);
}

// getItemCount() returns the number of items in the list
@Override
public int getItemCount() {
    // If the media list is not null, return the size of the media list. Otherwise, return 0.
    return mMediaList != null ? mMediaList.size() : 0;
}

// The ButtonClickListener interface defines two methods that can be implemented by a class that implements the interface
public interface ButtonClickListener{
    // onButtonClick() is called when the delete button is clicked and passes the position of the clicked item
    void onButtonClick(int clickedposition);
    // currentPosition() is called when the user interacts with the seek bars and passes the position of the item being interacted with
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
            // Initialize UI views
            ImageButton playBtn = itemView.findViewById(R.id.button_play);
            ImageButton pauseBtn = itemView.findViewById(R.id.button_pause);
            ImageButton deleteBtn = itemView.findViewById(R.id.button_delete);
            editText = itemView.findViewById(R.id.editText);
            seekBarVolume = itemView.findViewById(R.id.seekbar_volume);
            seekBarSpeed = itemView.findViewById(R.id.seekbar_speed);
            volumeText = itemView.findViewById(R.id.volume_text);
            speedText = itemView.findViewById(R.id.speed_text);
            // Set click and seek bar listeners
            playBtn.setOnClickListener(this);
            pauseBtn.setOnClickListener(this);
            deleteBtn.setOnClickListener(this);
            seekBarVolume.setOnSeekBarChangeListener(this);
            seekBarSpeed.setOnSeekBarChangeListener(this);
        }
        
        @Override
        public void onClick(View view) {
            // Get the position of the clicked item in the adapter
            buttonListener.currentPosition(getAdapterPosition());
            MediaPlayer music = mMediaList.get(getAdapterPosition());
            String tag = view.getTag().toString();
            // Respond to click events based on the tag of the clicked view
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
            // Get the position of the item whose seek bar is changed in the adapter
            buttonListener.currentPosition(getAdapterPosition());
            MediaPlayer music = mMediaList.get(getAdapterPosition());
            String tag = seekBar.getTag().toString();
            // Respond to seek bar changes based on the tag of the seek bar view
            if (tag.equals("volume")) {
                if(progress > 0) {
                    // Update the volume text and set the media player volume
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
                    // Update the speed text and set the media player playback speed
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
        
}