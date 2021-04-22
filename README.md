composer create-project --prefer-dist laravel/laravel lrc-blog
cd lrc-mini-blog
composer require laravel/ui
php artisan ui react --auth

npm install && npm run dev
npm install resolve-url-loader@^3.1.2 --save-dev --legacy-peer-deps

Creer les models  status et commentaire avec migration :
php artisan make:model Status -m

    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->timestamps();
        });
    }

php artisan make:model Comment -m

       Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('status_id')->constrained('statuses')->onDelete('cascade');
            $table->timestamps();
        });

Ajouter les relation dans le Model Status.php

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

Ajouter les relation dans le Model Comment.php

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function status() {
        return $this->belongsTo(Status::class);
    }

Ajouter les relation dans le Model User.php

    public function statuses() {
        return $this->hasMany(Status::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

Creer les controllers et ajouter les fonctions:
php artisan make:controller StatusController 

    
    // list des status 
	public function index(Request $request, Status $status) {

		$statuses = Status::with('user','comments.user')->orderBy('created_at', 'desc')->get();
        
		return response()->json([
			'statuses' => $statuses,
		]);
	}

        // Sauvegarde un status dans la base de donnee
        public function store(Request $request)
    {
        // validate
		$this->validate($request, [
			'name' => 'required|max:255',
		]);
		// create a new status based on user status relationship
		$status = $request->user()->statuses()->create([
			'name' => $request->name,
		]);
		// return status with user object
		return response()->json($status->with('user')->find($status->id));
    }

        //Suppression d'un status

        public function destroy($id) {
        Status::findOrFail($id)->delete();
        return response()->json("Status deleted succefully");
    }

php artisan make:controller CommentController 

   // lister les commentaire lier a un status

    public function index(Request $request, Status $status)
    {
       
        //$comments  = Comment::with('status','user')->get();
        $comments = $status->comments()->orderBy('created_at', 'desc')->with('user')->get();

         //$comments = Status::with('comments')->orderBy('created_at', 'desc')->get();
       
		// return json response
		return response()->json([
			'comments' => $comments,
		]);
    }

  // Sauvegarde commentaire dans la base de donnee

    public function store(Request $request)
    {
        // validate
		$this->validate($request, [
			'name' => 'required|max:255',
		]);
		// create a new status based on user status relationship
		$comment = $request->user()->comments()->create([
			'name' => $request->name,
            'status_id' => $request->status,
		]);

		// return status with user object
		return response()->json($comment->with('user')->find($comment->id));
    }

    // Suppression d'un commentaire

        public function destroy($id) {
        Comment::findOrFail($id)->delete();
        return response()->json("Comment deleted succefully");
    }

Mettre le route 

Route::resource('/statuses', StatusController::class);
Route::resource('/comments', CommentController::class)->except('index');
Route::get('/comments/status/{status}', [CommentController::class,'index'])->name('index');


Coté react: 

Creer les hooks avec des methodes globaux qui sert a communiquer 
avec les controller 

Fichier hooks.js

Traitement des statuses
fichier Statuses.js

Traitement des commentaire
fichier Comments.js

Pour installer l'application dans un envirenement quelquante,
il faut taper les commandes suivantes:

git clone https://github.com/dali/laravel-mini-blog.git

php artisan key:generate
composer install
composer dump-autoload

Modifier le fichier .env les information de la base de donnee avec votre base local

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=Nom de la base de donnee
DB_USERNAME=Nom d'utilisateur
DB_PASSWORD=Mot de passe

php artisan migrate:refresh --seed
php artisan view:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear
npm install
npm run dev

pour lancer le serveur
php artisan serve


