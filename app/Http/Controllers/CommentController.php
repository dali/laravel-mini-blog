<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Status;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{


    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }



    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
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


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        Comment::findOrFail($id)->delete();
        return response()->json("Comment deleted succefully");
    }
}
