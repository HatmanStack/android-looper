package gemenie.looper;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.media.SoundPool;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Vibrator;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.text.format.Time;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.PopupWindow;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MainActivity extends AppCompatActivity implements SoundControlsAdapter.ButtonClickListener {
	private static final int LOAD_QUALITY = 1;
	private List<Integer> soundsList = new ArrayList<>();
	private SoundPool mSoundPool;
	private SoundControlsAdapter adapter;
	public static final String TAG = "TAG";
	private RecyclerView activityRecyclerView;
	public ArrayList<MediaPlayer> mediaPlayerList = new ArrayList<>();
	private ArrayList<Uri> uriList = new ArrayList<>();
	public static final String URIs = "uri";
	public int CurrentPosition;
	public static final int ReturnCodeFile = 1002;
	private MediaRecorder mediaRecorder;
	private PopupWindow popupWindow;
	private Boolean isRecording= false;
	private final String[] permissions = {Manifest.permission.RECORD_AUDIO, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE};


// Initialize the activity on create
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Set the layout to the activity main
    setContentView(R.layout.activity_main);

    // Find the RecyclerView from the layout and assign it to activityRecyclerView
    activityRecyclerView = findViewById(R.id.recyclerview);

    // Request permissions
    getPermissions();

    // Create a new SoundPool instance
    mSoundPool = new SoundPool.Builder()
            .setMaxStreams(10)
            .build();

    // Load sounds to SoundPool
    loadSoundPool();

    // If there is a saved instance, retrieve it and assign it to uriList
    if (savedInstanceState != null) {
        ArrayList<String> holder = savedInstanceState.getStringArrayList(URIs);
        uriList.clear();
        for (String u : holder) {
            Uri uri = Uri.parse(u);
            uriList.add(uri);

            // Add to media player list
            addToMediaPlayerList(uri);
        }

        // Get sound controls
        getSoundControls();
    }

    // Get sound controls
    getSoundControls();
}

// Request necessary permissions
public void getPermissions() {
    if (ActivityCompat.checkSelfPermission(this, permissions[0]) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(this, permissions[1]) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(this, permissions[2]) != PackageManager.PERMISSION_GRANTED) {
        ActivityCompat.requestPermissions(this, permissions, 100);
    }
}

// Handle permission request result
@Override
public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    // If record audio, write external storage, and read external storage permissions are not granted, finish activity
    if (ActivityCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED ||
            ActivityCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED ||
            ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
        finish();
    }
}

// Load sound resources to SoundPool
public void loadSoundPool() {
    for (int soundResource : SOUND_RESOURCES) {
        soundsList.add(mSoundPool.load(this, soundResource, LOAD_QUALITY));
    }
}

// Play a random sound from the SoundPool
public void playSoundPool() {
    Random x = new Random();
    int y = x.nextInt(7);
    mSoundPool.play(soundsList.get(y), 1, 1, 1, 0, 1);
}

// Vibrate the phone
public void vibratePhone() {
    Vibrator vibe = (Vibrator) this.getSystemService(Context.VIBRATOR_SERVICE);
    vibe.vibrate(5);
}

// Initialize MediaRecorder with specified file
public MediaRecorder initMediaRecorder(File file) throws IOException {
    MediaRecorder recorder = new MediaRecorder();
    recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
    recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
    recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
    recorder.setOutputFile(file);
    // Prepare the recorder for recording
    try (recorder) {
        recorder.prepare();
    }
    return recorder;
}

// Start recording audio
public void recordWavStart(View v) {
    vibratePhone();
    getFile(); // Get file name
    // Start recording audio to file
    mediaRecorder = initMediaRecorder(new File(String.valueOf(uriList.get(uriList.size() - 1))));
    mediaRecorder.start();
    isRecording = true;
}

// Stop recording audio
public void recordWavStop(View v) {
    if (isRecording) {
        mediaRecorder.stop(); // Stop recording
        addToMediaPlayerList(uriList.get(uriList.size() - 1)); // Add to media player list
        adapter.notifyDataSetChanged(); // Update list view
        isRecording = false;
    }
}

// Generate file name and add it to the list of files
private void getFile() {
    Time time = new Time();
    time.setToNow();
    String timeString = time.format("%Y%m%d%H%M%S");
    uriList.add(Uri.parse(this.getFilesDir() + "/" + timeString + ".mp3"));
}

// Add the specified URI to the media player list
private void addToMediaPlayerList(Uri uri) {
    MediaPlayer player = new MediaPlayer();
    // Set audio attributes for the media player
    player.setAudioAttributes(new AudioAttributes.Builder()
        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
        .setUsage(AudioAttributes.USAGE_MEDIA)
        .build()
    );
    try {
        player.setDataSource(getApplicationContext(), uri); // Set data source for the media player
        player.prepare(); // Prepare the media player for playback
        // Set a listener to pause the media player when it starts playing
        player.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
            @Override
            public void onPrepared(MediaPlayer mediaPlayer) {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.pause();
                } else {
                    mediaPlayer.start();
                    mediaPlayer.pause();
                }
            }
        });
        mediaPlayerList.add(player); // Add the media player to the list
    } catch (IOException e) {
        e.printStackTrace();
    }
}


// This method plays a sound.
public void savePersistent(View v) {
    playSoundPool();

    // Get the parent view of the clicked view.
    View parent = (View) v.getParent();

    // Find the EditText view with the id "save_file_name" in the parent view.
    EditText text = parent.findViewById(R.id.save_file_name);

    // If the text in the EditText is not empty, create a file with the given name and copy the current audio file to it.
    if (text.length() > 0) {
        File file = new File(getAlbumStorageDir("Looper"), text.getText().toString() + ".mp3");
        try {
            File copyFile = new File(String.valueOf(uriList.get(CurrentPosition)));
            copy(copyFile, file);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Dismiss the popup window.
    popupWindow.dismiss();
}

// This method returns the directory where the audio file will be saved.
public File getAlbumStorageDir(String albumName) {
    File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), albumName);

    // If the directory does not exist, log an error message.
    if (!file.mkdirs()) {
        Log.e("TAG", "Directory not created");
    }

    return file;
}

// This method copies the current audio file to the specified destination file.
public static void copy(File src, File dst) throws IOException {
    InputStream in = new FileInputStream(src);
    try {
        OutputStream out = new FileOutputStream(dst);
        try {
            byte[] buf = new byte[1024];
            int len;

            // Read bytes from the input stream and write them to the output stream.
            while ((len = in.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
        } finally {
            out.close();
        }
    } finally {
        in.close();
    }
}

// This method shows a popup window where the user can save the current audio file.
public void savePopUp(View v) {
    // If there is at least one audio file in the list, show the popup window.
    if (uriList.size() > 0) {
        LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
        View popupView = inflater.inflate(R.layout.popup, null);
        int width = LinearLayout.LayoutParams.WRAP_CONTENT;
        int height = LinearLayout.LayoutParams.WRAP_CONTENT;

        // Create a new PopupWindow with the popup view, set its size and show it.
        popupWindow = new PopupWindow(popupView, width, height, true);
        popupWindow.showAtLocation(v, Gravity.CENTER, 0, 0);

        // Find the TextView with the id "track_to_be_saved" in the popup view and set its text.
        Button textView = popupView.findViewById(R.id.track_to_be_saved);
        String text = getString(R.string.track_text) + " " + CurrentPosition;
        textView.setText(text);
    }
}

public void listPersistent(View v) {
    // open file picker with initial directory set to music folder
    openFile(Uri.parse("/storage/emulated/0/Music"));
}

private void openFile(Uri pickerInitialUri) {
    // create intent to open document picker for audio files
    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
    intent.addCategory(Intent.CATEGORY_OPENABLE);
    intent.setType("audio/*");
    // set initial directory to the provided URI
    intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
    // start activity to pick file
    startActivityForResult(intent, ReturnCodeFile);
}

@Override
public void onActivityResult(int requestCode, int resultCode, Intent resultData) {
    super.onActivityResult(requestCode, resultCode, resultData);
    // if file was successfully picked
    if (requestCode == ReturnCodeFile && resultCode == Activity.RESULT_OK) {
        Uri uri = resultData.getData();
        // release all currently playing media players
        for (MediaPlayer mediaPlayer : mediaPlayerList) {
            mediaPlayer.release();
        }
        if (resultData != null) {
            // add new media player for selected file to list
            addToMediaPlayerList(uri);
            uriList.add(uri);
            adapter.notifyDataSetChanged();
        }
    }
}

public void getSoundControls() {
    // set up recycler view to display sound controls
    adapter = new SoundControlsAdapter(mediaPlayerList, this);
    activityRecyclerView.setAdapter(adapter);
    LinearLayoutManager layoutManager = new LinearLayoutManager(this);
    activityRecyclerView.setLayoutManager(layoutManager);
}

@Override
public void currentPosition(int clickedposition) {
    // set current position of media player for use with seek bar
    CurrentPosition = clickedposition;
}

@Override
public void onButtonClick(int clickedposition) {
    // release media player and remove from list when stop button is clicked
    mediaPlayerList.get(clickedposition).release();
    mediaPlayerList.remove(clickedposition);
    uriList.remove(clickedposition);
    adapter.notifyDataSetChanged();
}
@Override
protected void onSaveInstanceState(Bundle outState) {
    // create an ArrayList to hold URIs as Strings
    ArrayList<String> holder = new ArrayList<>();
    // check if uriList is not null
    if(uriList != null) {
        // loop through uriList and add each Uri as a String to holder
        for(Uri uri : uriList){
            holder.add(String.valueOf(uri));
        }
        // add holder to the bundle
        outState.putStringArrayList(URIs, holder);
    }
    // release all MediaPlayers in mediaPlayerList
    for(MediaPlayer media: mediaPlayerList){
        media.release();
    }
    // call super method to save the instance state
    super.onSaveInstanceState(outState);
}

@Override
protected void onDestroy() {
    super.onDestroy();
    // release all MediaPlayers in mediaPlayerList
    for(MediaPlayer player: mediaPlayerList){
        if (player != null){
            player.release();
        }
    }
}

	private static final int[] SOUND_RESOURCES = {
		R.raw.boom_kick,
		R.raw.gubbler_drum,
		R.raw.nice_one,
		R.raw.ready,
		R.raw.robot_intro,
		R.raw.thunder,
		R.raw.whoosh
	};
}

