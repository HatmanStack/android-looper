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
	private List<Integer> mSound = new ArrayList<>();
	private SoundPool mSoundPool;
	private SoundControlsAdapter adapter;
	public static final String TAG = "TAG";
	private RecyclerView activityRecyclerView;
	public ArrayList<MediaPlayer> mediaPlayerList = new ArrayList<>();
	private ArrayList<Uri> uRIS = new ArrayList<>();
	public static final String URIs = "uris";
	public int CurrentPosition;
	public static final int ReturnCodeFile = 1002;
	private MediaRecorder mediaRecorder;
	private PopupWindow popupWindow;
	private Boolean isRecording= false;
	private final String[] permissions = {Manifest.permission.RECORD_AUDIO, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE};


	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		activityRecyclerView = findViewById(R.id.recyclerview);
		getPermissions();
		mSoundPool = new SoundPool.Builder()
				.setMaxStreams(10)
				.build();
		loadSoundPool();
		if (savedInstanceState != null) {
			ArrayList<String> holder = savedInstanceState.getStringArrayList(URIs);
			uRIS.clear();
			for (String u : holder) {
				Log.i("TAG", "URIS: " + u);
				Uri uri = Uri.parse(u);
				uRIS.add(uri);
				addToMediaPlayerList(uri);
			}
			Log.i("TAG", "SIZE:  " + mediaPlayerList.size());
			getSoundControls();
		}
		getSoundControls();
	}

	public MediaRecorder initMediaRecorder(File file){
		MediaRecorder m = new MediaRecorder();
		m.setAudioSource(MediaRecorder.AudioSource.MIC);
		m.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
		m.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
		m.setOutputFile(file);
		try {
			m.prepare();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return m;
	}


	public void getPermissions() {
		if (ActivityCompat.checkSelfPermission(this, permissions[0]) != PackageManager.PERMISSION_GRANTED &&
				ActivityCompat.checkSelfPermission(this, permissions[1]) != PackageManager.PERMISSION_GRANTED &&
				ActivityCompat.checkSelfPermission(this, permissions[2]) != PackageManager.PERMISSION_GRANTED) {
			ActivityCompat.requestPermissions(this, permissions, 100);
		}
	}

	@Override
	public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
		if (ActivityCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED ||
				ActivityCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED ||
				ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
			finish();
		}
	}

	public void loadSoundPool() {
		mSound.add(mSoundPool.load(this, R.raw.boom_kick, 1));
		mSound.add(mSoundPool.load(this, R.raw.gubbler_drum, 1));
		mSound.add(mSoundPool.load(this, R.raw.nice_one, 1));
		mSound.add(mSoundPool.load(this, R.raw.ready, 1));
		mSound.add(mSoundPool.load(this, R.raw.robot_intro, 1));
		mSound.add(mSoundPool.load(this, R.raw.thunder, 1));
		mSound.add(mSoundPool.load(this, R.raw.whoosh, 1));
	}

	public void playSoundPool() {
		System.out.println(mSound);
		Random x = new Random();
		int y = x.nextInt(7);
		mSoundPool.play(mSound.get(y), 1, 1, 1, 0, 1);
	}

	public void vibratePhone() {
		Vibrator vibe = (Vibrator) this.getSystemService(Context.VIBRATOR_SERVICE);
		vibe.vibrate(5);
	}

	public void recordWavStart(View v) {
		vibratePhone();
		getFile();
		mediaRecorder = initMediaRecorder(new File(String.valueOf(uRIS.get(uRIS.size() - 1))));
		mediaRecorder.start();
		isRecording = true;
	}

	public void recordWavStop(View v) {
		if(isRecording) {
			mediaRecorder.stop();
			addToMediaPlayerList(uRIS.get(uRIS.size() - 1));
			adapter.notifyDataSetChanged();
			isRecording = false;
		}
	}

	private void getFile() {
		Time time = new Time();
		time.setToNow();
		String timeString = time.format("%Y%m%d%H%M%S");
		uRIS.add(Uri.parse(this.getFilesDir() + "/" + timeString + ".mp3"));
	}

	private void addToMediaPlayerList(Uri uri){
		MediaPlayer player = new MediaPlayer();
		player.setAudioAttributes(new AudioAttributes.Builder()
				.setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
				.setUsage(AudioAttributes.USAGE_MEDIA)
				.build()
		);
		try {
			player.setDataSource(getApplicationContext(), uri);
			player.prepare();
			player.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
				@Override
				public void onPrepared(MediaPlayer mediaPlayer) {
					if(mediaPlayer.isPlaying()){
						mediaPlayer.pause();
					}else {
						mediaPlayer.start();
						mediaPlayer.pause();
					}
				}
			});
			mediaPlayerList.add(player);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	public void savePersistent(View v){
		playSoundPool();
		View parent = (View) v.getParent();
		EditText text = parent.findViewById(R.id.save_file_name);
		if(text.length() > 0) {
			File filex = getAlbumStorageDir("Looper");
			File file = new File(filex, text.getText().toString() + ".mp3");
			try {
				Log.i("TAG", "" + uRIS.get(CurrentPosition));
				File copyFile = new File(String.valueOf(uRIS.get(CurrentPosition)));
				copy(copyFile, file);
				Log.i("TAG", "COPYING FILES : " + file.getAbsolutePath());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		popupWindow.dismiss();
	}

	public File getAlbumStorageDir(String albumName) {
		File file = new File(Environment.getExternalStoragePublicDirectory(
				Environment.DIRECTORY_DOWNLOADS), albumName);
		if (!file.mkdirs()) {
			Log.e("TAG", "Directory not created");
		}
		return file;
	}

	public static void copy(File src, File dst) throws IOException {
		InputStream in = new FileInputStream(src);
		try {
			OutputStream out = new FileOutputStream(dst);
			try {
				// Transfer bytes from in to out
				byte[] buf = new byte[1024];
				int len;
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

	public void savePopUp(View v){
		if (uRIS.size() > 0) {
			LayoutInflater inflater = (LayoutInflater)
					getSystemService(LAYOUT_INFLATER_SERVICE);
			View popupView = inflater.inflate(R.layout.popup, null);
			// create the popup window
			int width = LinearLayout.LayoutParams.WRAP_CONTENT;
			int height = LinearLayout.LayoutParams.WRAP_CONTENT;
			popupWindow = new PopupWindow(popupView, width, height, true);
			popupWindow.showAtLocation(v, Gravity.CENTER, 0, 0);
			Button textView = popupView.findViewById(R.id.track_to_be_saved);
			String text = getString(R.string.track_text) + " " + CurrentPosition;
			textView.setText(text);
		}
	}

	public void listPersistent(View v){
		openFile(Uri.parse("/storage/emulated/0/Music"));
	}

	private void openFile(Uri pickerInitialUri) {
		Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
		intent.addCategory(Intent.CATEGORY_OPENABLE);
		intent.setType("audio/*");
		intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, pickerInitialUri);
		startActivityForResult(intent, ReturnCodeFile);
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode,
								 Intent resultData) {
		super.onActivityResult(requestCode, resultCode, resultData);
		if (requestCode == ReturnCodeFile
				&& resultCode == Activity.RESULT_OK) {
			// The result data contains a URI for the document or directory that
			// the user selected.
			Uri uri = resultData.getData();
			for(MediaPlayer mediaPlayer: mediaPlayerList){
				mediaPlayer.release();
			}
			if (resultData != null) {
				addToMediaPlayerList(uri);
				uRIS.add(uri);
				//Log.i("TAG", "URISFROMIMPORT:  " + String.valueOf(uriFromImport));
				//getFile();
				adapter.notifyDataSetChanged();
			}
		}
	}

	public void getSoundControls() {
		adapter = new SoundControlsAdapter(mediaPlayerList, this);
		activityRecyclerView.setAdapter(adapter);
		LinearLayoutManager layoutManager = new LinearLayoutManager(this);
		activityRecyclerView.setLayoutManager(layoutManager);
	}

	@Override
	public void currentPosition(int clickedposition) {
		Log.i("TAG", "BUTTON SOUND CONTROL CLICK");
		CurrentPosition = clickedposition;
	}

	@Override
	public void onButtonClick(int clickedposition) {
		mediaPlayerList.get(clickedposition).release();
		mediaPlayerList.remove(clickedposition);
		uRIS.remove(clickedposition);
		adapter.notifyDataSetChanged();
	}

	@Override
	protected void onSaveInstanceState(Bundle outState) {
		ArrayList<String> holder = new ArrayList<>();
		if(uRIS != null) {
			for(Uri uri : uRIS){
				holder.add(String.valueOf(uri));
			}
			outState.putStringArrayList(URIs, holder);
		}
		for(MediaPlayer media: mediaPlayerList){
			media.release();
		}
		super.onSaveInstanceState(outState);
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		for(MediaPlayer player: mediaPlayerList){
			if (player != null){
				player.release();
			}
		}
	}
}

