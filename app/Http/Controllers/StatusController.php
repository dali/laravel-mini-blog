<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Status;
use App\Models\Comment;

class StatusController extends Controller
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
	public function index(Request $request, Status $status) {

		$statuses = Status::with('user','comments.user')->orderBy('created_at', 'desc')->get();
        
		return response()->json([
			'statuses' => $statuses,
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
		$status = $request->user()->statuses()->create([
			'name' => $request->name,
		]);
		// return status with user object
		return response()->json($status->with('user')->find($status->id));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id) {
        Status::findOrFail($id)->delete();
        return response()->json("Status deleted succefully");
    }
}
