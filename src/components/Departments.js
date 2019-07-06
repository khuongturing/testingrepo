import React from 'react';
import { connect } from 'react-redux';
import { selectDepartment, selectCategoryFromDepartment, selectProductFromDepartment } from '../actions';
import '../css/Departments.css';
import SearchBar from './SearchBar';
import { Link } from "react-router-dom";


class Departments extends React.Component {
    state = {data:'',pageInfo:''}; ; 

        /* On component mount fire api call and load with departments */
    componentDidMount(){
        this.props.selectDepartment();
    }

       /* Invoke actions to load Content Page component with Categories and Products based on the Department id clicked*/ 
    onDepartmentClick = (event, department_id) => {

        event.persist();
        console.log('event',event)
       
        var siblings = [];
        var sibling = event.target.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1) {
                siblings.push(sibling);
            }
            
            sibling.className = 'ui pointing item departmentName';
            sibling = sibling.nextSibling;
        }
        this.props.selectProductFromDepartment(department_id,1);
        //event.currentTarget.className = 'ui pointing item active departmentName';
        event.target.className = 'ui pointing item active departmentName';

        this.props.selectCategoryFromDepartment(department_id);       
    }

    renderList(){
        return this.props.departments.map(department => {
            return(            
                <li key={department.department_id} className={`ui pointing item departmentName`} onClick = {(event) => this.onDepartmentClick(event, department.department_id)}>
                    {department.name} 
                </li>           
            )
        })
    }

    /* Returns logo text, departments bar and Search bar components*/ 
    render(){  
        return (
            <div className={`ui pointing menu departmentBar`} >
                <Link to="/" >
                    <div className={`ui label logo`}>
                        <h1 className={`logoText`}>SHOPMATE</h1>
                    </div>
                </Link>
                <span className={`departmentText`}>
                    {this.renderList()}
                </span>
                <div className="right menu">
                    <SearchBar />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { departments: state.departments };
}

export default connect(mapStateToProps, { selectDepartment, selectCategoryFromDepartment, selectProductFromDepartment })(Departments);
